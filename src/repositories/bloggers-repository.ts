import {bloggersCollection, postsCollection} from "./db"
import {BloggerDBType, PostDBType} from "./types";

export const bloggersRepository = {
    async findBloggers(SearchNameTerm: string | null, pageNumber: number, pageSize: number): Promise<any> {
        const filter: {name?: any} = {}
        if (SearchNameTerm) {
            filter.name = {$regex: SearchNameTerm}
        }
        const skip = (pageNumber - 1) * pageSize
        let allBloggers = await bloggersCollection.find({}).toArray()
        let pagesCount = allBloggers.length / pageSize
        let bloggers = await bloggersCollection.find(filter, {projection: {_id: 0}}).skip(skip).limit(pageSize).toArray()
        let allCount = await bloggersCollection.countDocuments(filter)
        return {
            pagesCount: Math.ceil(pagesCount),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allCount,
            items: bloggers
        }
    },
    async findBloggerById(id: number): Promise<BloggerDBType | null> {
        let blogger: BloggerDBType | null = await bloggersCollection.findOne({id: id}, {projection: {_id: 0}})
        return blogger
    },
    async findBloggerPosts(id: number, pageNumber: number, pageSize: number): Promise<any> {
        //let bloggerPosts: PostDBType[] | null = await postsCollection.find({id: id}, {projection: {_id: 0}}).limit(1).toArray()
        const skip = (pageNumber - 1) * pageSize
        let allBloggers = await bloggersCollection.find({id: id}).toArray()
        let pagesCount = allBloggers.length / pageSize
        let posts = await bloggersCollection.find({id: id}, {projection: {_id: 0}}).skip(skip).limit(pageSize).toArray()
        let allCount = await bloggersCollection.countDocuments({id: id})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allCount,
            items: posts
        }
    },
    async createBlogger(newBlogger: BloggerDBType): Promise<BloggerDBType> {
        const result = await bloggersCollection.insertOne({...newBlogger})
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