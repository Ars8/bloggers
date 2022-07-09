import {bloggersCollection, postsCollection} from "./db"
import {BloggerDBType, PostDBType} from "./types";
import {WithId} from "mongodb";

export const bloggersRepository = {
    async findBloggers(SearchNameTerm: string | null, pageNumber: number, pageSize: number): Promise<any> {
        const filter: {name?: any} = {}
        if (SearchNameTerm) {
            filter.name = {$regex: SearchNameTerm}
        }
        const skip = (pageNumber - 1) * pageSize
        let allBloggers = await bloggersCollection.find(filter).toArray()
        let pagesCount = allBloggers.length / pageSize
        let bloggers: WithId<BloggerDBType>[] = await bloggersCollection.find(filter, {projection: {_id: 0}}).skip(skip).limit(pageSize).toArray()
        let allCount = await bloggersCollection.countDocuments(filter)
        return {
            pagesCount: Math.ceil(pagesCount),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allCount,
            items: bloggers
        }
    },
    async findBloggerById(id: string): Promise<BloggerDBType | null> {
        let blogger: BloggerDBType | null = await bloggersCollection.findOne({id: id}, {projection: {_id: 0}})
        return blogger
    },
    async findBloggerPosts(id: string, pageNumber: number, pageSize: number): Promise<any> {
        //let bloggerPosts: PostDBType[] | null = await postsCollection.find({id: id}, {projection: {_id: 0}}).limit(1).toArray()
        const skip = (pageNumber - 1) * pageSize
        let allPosts = await postsCollection.find({bloggerId: id}).toArray()
        let pagesCount = allPosts.length / pageSize
        let posts = await postsCollection.find({bloggerId: id}, {projection: {_id: 0}}).skip(skip).limit(pageSize).toArray()
        let allCount = await postsCollection.countDocuments({bloggerId: id})
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
    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async delete(id: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}