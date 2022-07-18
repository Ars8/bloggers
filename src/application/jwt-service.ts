import {UserAccountDBType, UserDBType} from "../repositories/types"
import jwt from 'jsonwebtoken'

export const jwtService = {
    async createJWT(user: UserAccountDBType) {
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET || '123', {expiresIn: '1h'})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123')
            return result.userId
        } catch (error) {
            return null
        }
    }
}