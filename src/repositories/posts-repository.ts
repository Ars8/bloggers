import {postsCollection} from "./db";
import {PostDBType} from "./types";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async findPosts(title: string | null | undefined): Promise<PostDBType[]> {
        const filter: any = {}

        if (title) {
            filter.title = {$regex: title}
        }

        return postsCollection.find(filter, {projection: {_id: 0}}).toArray()
    },
    async findPostById(id: ObjectId): Promise<PostDBType | null> {
        let post: PostDBType | null = await postsCollection.findOne({_id: id})
        return post
    },
    async createPost(newPost: PostDBType): Promise<PostDBType> {
        const result = await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(id: ObjectId, title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<boolean> {
        const result = await postsCollection.updateOne(
            {_id: id},
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
    async delete(id: ObjectId): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: id})
        return result.deletedCount === 1
    }
}
