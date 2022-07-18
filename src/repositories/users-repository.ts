import {usersCollection} from "./db";
import {UserAccountDBType, UserDBType} from "./types";
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
                return {
                    id: user.id,
                    login: user.accountData.login
                }
            })
        }
    },
    async getAllUsers(): Promise<WithId<UserAccountDBType>[]> {
        return usersCollection
            .find()
            .sort('createdAt', -1)
            .toArray()
    },
    async createUser(user: UserAccountDBType): Promise<UserAccountDBType> {
        const result = await usersCollection.insertOne(user)
        return user
    },
    async findUserById(id: string): Promise<UserAccountDBType | null> {
        let user: UserAccountDBType | null = await usersCollection.findOne({id: id})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findByLogin(login: string) {
        const user = await usersCollection.findOne({'accountData.login': login})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findByEmail(email: string) {
        const user = await usersCollection.findOne({'accountData.email': email})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findUserByConfirmationCode(emailConfirmationCode: string) {
        const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async updateConfirmation(id: string) {
        let result = await usersCollection.updateOne({id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },
    async delete(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}