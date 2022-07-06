import bcrypt from 'bcrypt'
import {PostDBType, UserDBType} from "../repositories/types";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {postsRepository} from "../repositories/posts-repository";

export const usersService = {
    async getAllUsers(PageNumber: number, PageSize: number) {
        return usersRepository.findUsers(PageNumber, PageSize)
    },
    async findUserById(id: ObjectId): Promise<UserDBType | null> {
        return usersRepository.findUserById(id)
    },
    async createUser(login: string, password: string): Promise<UserDBType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            _id: new ObjectId(),
            login: login,
            passwordHash,
            passwordSalt,
            createdAt: new Date()
        }
        return usersRepository.createUser(newUser)
    },
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findByLogin(login)
        if(!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }

        return user
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}