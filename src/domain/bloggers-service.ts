import {BloggerDBType, PostDBType} from "../repositories/types";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const bloggersService = {
    async findBloggers(SearchNameTerm: string | null | undefined, page: number, pageSize: number): Promise<BloggerDBType[]> {
        return bloggersRepository.findBloggers(SearchNameTerm, page, pageSize)
    },
    async findBloggerById(id: number): Promise<BloggerDBType | null> {
        return bloggersRepository.findBloggerById(id)
    },
    async findBloggerPosts(id: number): Promise<PostDBType[]> {
        return bloggersRepository.findBloggerPosts(id)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerDBType> {
        const newBlogger: BloggerDBType = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
        return await bloggersRepository.createBlogger(newBlogger)
    },
    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },
    async deleteBlogger(id: number): Promise<boolean> {
        return await bloggersRepository.delete(id)
    }
}