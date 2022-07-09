import {CommentDBType, PostDBType} from "../repositories/types";
import {postsRepository} from "../repositories/posts-repository";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const postsService = {
    async findPosts(PageNumber: number, PageSize: number): Promise<PostDBType[]> {
        return postsRepository.findPosts(PageNumber, PageSize)
    },
    async findPostById(id: string): Promise<PostDBType | null> {
        return postsRepository.findPostById(id)
    },
    async findPostComments(id: string, PageNumber: number, PageSize: number): Promise<CommentDBType[]> {
        return bloggersRepository.findBloggerPosts(id, PageNumber, PageSize)
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string | undefined): Promise<PostDBType | undefined> {
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        if (blogger) {
            const newPost: PostDBType = {
                id: new Date().toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: bloggerName
            }
            return await postsRepository.createPost(newPost)
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string | undefined): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content, bloggerId, bloggerName)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.delete(id)
    },
}