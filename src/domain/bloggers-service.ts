import {BloggerDBType, PostDBType} from "../repositories/types";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const bloggersService = {
    async findBloggers(title: string | null | undefined, PageSize: number): Promise<BloggerDBType[]> {
        return bloggersRepository.findBloggers(title, PageSize)
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
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return createdBlogger
    },
    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },
    async deleteBlogger(id: number): Promise<boolean> {
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