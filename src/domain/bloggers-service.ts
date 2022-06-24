import {BloggerDBType} from "../repositories/types";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {ObjectId} from "mongodb";

export const bloggersService = {
    async findBloggers(title: string | null | undefined): Promise<BloggerDBType[]> {
        return bloggersRepository.findBloggers(title)
    },
    async findBloggerById(id: ObjectId): Promise<BloggerDBType | null> {
        return bloggersRepository.findBloggerById(id)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerDBType> {
        const newBlogger: BloggerDBType = {
            id: +new Date(),
            name: name,
            youtubeUrl: youtubeUrl
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return createdBlogger
    },
    async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },
    async deleteBlogger(id: ObjectId): Promise<boolean> {
        return await bloggersRepository.delete(id)
    },
    /*async create(name: string, youtubeUrl: string): Promise<BloggerDBType> {
        const blogger: BloggerDBType = {
            _id: new ObjectId(),
            name: name,
            youtubeUrl: youtubeUrl
        }
        return bloggersRepository.createBlogger(blogger)
    },
    async findById(id: ObjectId): Promise<BloggerDBType | null> {
        return bloggersRepository.getBloggerById(id)
    },
    async update(id: ObjectId, name: string, youtubeUrl: string): Promise<BloggerDBType | null> {
        return bloggersRepository.updateBlogger(id, name, youtubeUrl)

    }*/
}