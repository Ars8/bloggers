import {BloggerDBType, PostDBType} from "../repositories/types";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const bloggersService = {
    async findBloggers(SearchNameTerm: string | null, page: number, pageSize: number): Promise<any> {
        return bloggersRepository.findBloggers(SearchNameTerm, page, pageSize)
    },
    async findBloggerById(id: string): Promise<BloggerDBType | null> {
        return bloggersRepository.findBloggerById(id)
    },
    async findBloggerPosts(id: string, PageNumber: number, PageSize: number): Promise<PostDBType[]> {
        return bloggersRepository.findBloggerPosts(id, PageNumber, PageSize)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerDBType> {
        const newBlogger: BloggerDBType = {
            id: new Date().toString(),
            name: name,
            youtubeUrl: youtubeUrl
        }
        return await bloggersRepository.createBlogger(newBlogger)
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },
    async deleteBlogger(id: string): Promise<boolean> {
        return await bloggersRepository.delete(id)
    }
}