import {bloggersCollection, commentsCollection, postsCollection} from "./db";
import {PostDBType} from "./types";

export const postsRepository = {
    async findPosts(pageNumber: number, pageSize: number): Promise<any> {
        const skip = (pageNumber - 1) * pageSize
        let allPosts = await postsCollection.find({}).toArray()
        let pagesCount = allPosts.length / pageSize
        let posts = await postsCollection.find({}, {projection: {_id: 0}}).skip(skip).limit(pageSize).toArray()
        let allCount = await postsCollection.countDocuments({})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allCount,
            items: posts
        }
    },
    async findPostById(id: string): Promise<PostDBType | null> {
        let post: PostDBType | null = await postsCollection.findOne({id: id}, {projection: {_id: 0}})
        return post
    },
    async findPostComments(id: string, pageNumber: number, pageSize: number): Promise<any> {
        const skip = (pageNumber - 1) * pageSize
        let allComments = await commentsCollection.find({id: id}).toArray()
        let pagesCount = allComments.length / pageSize
        let comments = await commentsCollection.find({id: id}, {projection: {_id: 0}}).skip(skip).limit(pageSize).toArray()
        let allCount = await postsCollection.countDocuments({bloggerId: id})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allCount,
            items: posts
        }
    },
    async createPost(newPost: PostDBType): Promise<PostDBType> {
        const result = await postsCollection.insertOne({...newPost})
        return newPost
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string | undefined): Promise<boolean> {
        const result = await postsCollection.updateOne(
            {id: id},
            {
                        $set:
                            {
                                title: title,
                                shortDescription: shortDescription,
                                content: content,
                                bloggerId: bloggerId,
                                bloggerName: bloggerName
                            }
                    }
            )
        return result.matchedCount === 1
    },
    async delete(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
