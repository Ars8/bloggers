import {postsCollection, usersCollection} from "./db";
import {PostDBType, UserDBType} from "./types";
import {ObjectId, WithId} from "mongodb";

export const usersRepository = {
    async findUsers(pageNumber: number, pageSize: number): Promise<any> {
        const skip = (pageNumber - 1) * pageSize
        let allUsers = await usersCollection.find({}).toArray()
        let pagesCount = allUsers.length / pageSize
        let users = await usersCollection.find({}, {projection: {_id: 0}}).skip(skip).limit(pageSize).toArray()
        let allCount = await usersCollection.countDocuments({})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allCount,
            items: users.map(user => {
                {
                    id: user._id.toString()
                    login: user.login
                }
            })
        }
    },
    async getAllUsers(): Promise<WithId<UserDBType>[]> {
        return usersCollection
            .find()
            .sort('createdAt', -1)
            .toArray()
    },
    async createUser(user: UserDBType): Promise<UserDBType> {
        const result = await usersCollection.insertOne(user)
        return user
    },
    async findUserById(id: ObjectId): Promise<UserDBType | null> {
        let user: UserDBType | null = await usersCollection.findOne({_id: id})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findByLogin(login: string) {
        const user = await usersCollection.findOne({login: login})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async delete(id: ObjectId): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: id})
        return result.deletedCount === 1
    }
}