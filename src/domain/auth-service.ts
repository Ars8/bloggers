import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import { ObjectId } from 'mongodb'
import { add } from 'date-fns'
import { usersRepository } from '../repositories/users-repository'
import { emailsManager } from '../managers/email-manager'

export const authService = {
    async createUser(login: string, email: string, password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const user = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date(),
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const createResult = await usersRepository.createUser(user)
        try {
            await emailsManager.sendEmailConfirmationMessage(user, createResult)
        } catch (err) {
            await usersRepository.deleteUser(user._id)
            return null
        }
        
        return createResult
    },
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findByLogin(login)
        if(!user) return false

        if (!user.emailConfirmation.isConfirmed) {
            return null
        }
        
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }

        return user
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async confirmEmail(code: string): Promise<boolean>{
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        let result = await usersRepository.updateConfirmation(user._id)
        return result
    }
}