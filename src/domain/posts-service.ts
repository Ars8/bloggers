import {PostDBType} from "../repositories/types";
import {postsRepository} from "../repositories/posts-repository";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const postsService = {
    async findPosts(PageNumber: number, PageSize: number): Promise<PostDBType[]> {
        return postsRepository.findPosts(PageNumber, PageSize)
    },
    async findPostById(id: number): Promise<PostDBType | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string | undefined): Promise<PostDBType | undefined> {
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        if (blogger) {
            const newPost: PostDBType = {
                id: +(new Date()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: bloggerName
            }
            return await postsRepository.createPost(newPost)
        }
    },
    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content, bloggerId, bloggerName)
    },
    async deletePost(id: number): Promise<boolean> {
        return await postsRepository.delete(id)
    },
}