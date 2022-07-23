import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import { add } from 'date-fns'
import {UserAccountDBType} from "../repositories/types";
import {usersRepository} from "../repositories/users-repository";
import { jwtService } from '../application/jwt-service';

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
        console.log(newUser.emailConfirmation.confirmationCode)
        return usersRepository.createUser(newUser)
    },
    async login(login: string, password: string) {
        const user = await usersRepository.findByLogin(login)
        if(!user) return null
        
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return null
        }

        const tokens = await jwtService.generateTokens(user.id)

        await jwtService.saveToken(user.id, tokens.refreshToken);

        return {...tokens, user}
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
    async refresh(refreshToken: string) {
        
        const userData = await jwtService.validateRefreshToken(refreshToken)
        const tokenFromDb = await jwtService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            return null
        }
        const user = await usersRepository.findUserByIdToken(userData)
        if (!user) {
            return null
        }
        const tokens = await jwtService.generateTokens(user.id);

        await jwtService.saveToken(user.id, tokens.refreshToken);
        return {...tokens, user}
    },
    async logout(refreshToken: string) {
        const token = await jwtService.removeToken(refreshToken);
        return token;
    },
}