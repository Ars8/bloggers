import {bloggersCollection, postsCollection} from "./db"
import {BloggerDBType, PostDBType} from "./types";

export const bloggersRepository = {
    async findBloggers(title: string | null | undefined): Promise<BloggerDBType[]> {
        const filter: any = {}
        if (title) {
            filter.title = {$regex: title}
        }

        return bloggersCollection.find(filter, {projection: {_id: 0}}).limit(1).toArray()
    },
    async findBloggerById(id: number): Promise<BloggerDBType | null> {
        let blogger: BloggerDBType | null = await bloggersCollection.findOne({id: id}, {projection: {_id: 0}})
        return blogger
    },
    async findBloggerPosts(id: number): Promise<PostDBType[]> {
        let bloggerPosts: PostDBType[] | null = await postsCollection.find({id: id}, {projection: {_id: 0}}).toArray()
        return bloggerPosts
    },
    async createBlogger(newBlogger: BloggerDBType): Promise<BloggerDBType> {
        const result = await bloggersCollection.insertOne(newBlogger)
        return newBlogger
    },
    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async delete(id: number): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id: id})
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