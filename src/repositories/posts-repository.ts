import {postsCollection} from "./db";
import {PostDBType} from "./types";

export const postsRepository = {
    async findPosts(title: string | null | undefined, PageSize: number = 1): Promise<PostDBType[]> {
        const filter: any = {}

        if (title) {
            filter.title = {$regex: title}
        }

        return postsCollection.find(filter, {projection: {_id: 0}}).limit(PageSize).toArray()
    },
    async findPostById(id: number): Promise<PostDBType | null> {
        let post: PostDBType | null = await postsCollection.findOne({id: id})
        return post
    },
    async createPost(newPost: PostDBType): Promise<PostDBType> {
        const result = await postsCollection.insertOne({...newPost})
        return newPost
    },
    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<boolean> {
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
    async delete(id: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
