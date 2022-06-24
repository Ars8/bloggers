import {bloggersCollection} from "./db"
import {BloggerDBType} from "./types";
import {ObjectId} from "mongodb";

export const bloggersRepository = {
    async findBloggers(title: string | null | undefined): Promise<BloggerDBType[]> {
        const filter: any = {}

        if (title) {
            filter.title = {$regex: title}
        }

        return bloggersCollection.find(filter).toArray()
    },
    async findBloggerById(id: ObjectId): Promise<BloggerDBType | null> {
        let blogger: BloggerDBType | null = await bloggersCollection.findOne({_id: id})
        return blogger
    },
    async createBlogger(newBlogger: BloggerDBType): Promise<BloggerDBType> {
        const result = await bloggersCollection.insertOne(newBlogger)
        return newBlogger
    },
    async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({_id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async delete(id: ObjectId): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({_id: id})
        return result.deletedCount === 1
    }
    /*async getBloggers(): Promise<BloggerDBType[]> {
        return bloggersCollection
            .find()
            .sort('createdAt', -1)
            .toArray()
    },
    async getBloggerById(id: ObjectId): Promise<BloggerDBType | null> {
        let blogger = await bloggersCollection.findOne({_id: id})
        if (blogger) {
            return blogger
        } else {
            return null
        }
    },
    async createBlogger(blogger: BloggerDBType): Promise<BloggerDBType> {
        const result = await bloggersCollection.insertOne(blogger)
        return blogger
    },
    async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<BloggerDBType | null> {
        const result = await bloggersCollection.updateOne(
            {_id: id},
            {
                $set: {
                    name: name,
                    youtubeUrl: youtubeUrl
                }
            })
        const updatedBlogger = await bloggersCollection.findOne({_id: id})
        return updatedBlogger
    }*/
}