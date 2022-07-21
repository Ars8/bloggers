import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import { add } from 'date-fns'
import {UserAccountDBType} from "../repositories/types";
import {usersRepository} from "../repositories/users-repository";

export const usersService = {
    async getAllUsers(PageNumber: number, PageSize: number) {
        return usersRepository.findUsers(PageNumber, PageSize)
    },
    async findUserById(id: string): Promise<UserAccountDBType | null> {
        return usersRepository.findUserById(id)
    },
    async createUser(login: string, email: string, password: string): Promise<UserAccountDBType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserAccountDBType = {
            id: new Date().toString(),
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            emailConfirmation: {
                isConfirmed: false,
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 72,
                    minutes: 1
                })
            }
        }
        return usersRepository.createUser(newUser)
    },
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findByLogin(login)
        if(!user) return null

        if (!user.emailConfirmation.isConfirmed) {
            return null
        }
        
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return false
        }

        return user
    },
    async findUserByLogin(login: string) {
        const user = await usersRepository.findByLogin(login)
        if (user) {
            return user
        } else {
            return null
        }
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.delete(id)
    },
}