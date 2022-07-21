import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import { usersRepository } from '../repositories/users-repository'
import { emailsManager } from '../managers/email-manager'
import { usersService } from './users-service'
import { UserAccountDBType } from '../repositories/types'

export const authService = {
    async createUser(login: string, email: string, password: string) {
        
        const user = await usersService.createUser(login, email, password)

        if (user) {
            try {
                await emailsManager.sendEmailConfirmationMessage(user)
            } catch (err) {
                console.error(err)
                await usersRepository.delete(user.id)
                return null
            }
        }        
        
        return user
    },
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findByLogin(login)
        if(!user) return false

        if (!user.emailConfirmation.isConfirmed) {
            return null
        }
        
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return false
        }

        return user
    },
    async checkIsConfirmed(email: string) {
        const user = await usersRepository.findByEmail(email)
        if (!user) {
            return null
        }
        return user
    },  
    async checkLogin(login: string) {
        const user = await usersRepository.findByLogin(login)
        if(!user) return false
        
        return user
    },    
    async checkEmail(email: string) {
        const user = await usersRepository.findByEmail(email)
        if(!user) return false
        
        return user
    },    
    async checkCode(code: string) {
        const user = await usersRepository.findUserByConfirmationCode(code)
        if(!user) return false
        
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
        if (user.emailConfirmation.expirationDate < new Date()) return false

        const result = await usersRepository.updateConfirmation(user.id)
        return result
    },
    async resendConfirmEmail(user: UserAccountDBType) {
        const newConfirmationCode = uuidv4()
        await emailsManager.reSendEmailConfirmationMessage(user, newConfirmationCode)

    }
}