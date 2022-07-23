import {UserAccountDBType, UserDBType, UserDtoType} from "../repositories/types"
import jwt from 'jsonwebtoken'

export const jwtService = {
    async createJWT(user: UserAccountDBType) {
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET || '123', {expiresIn: '1h'})
        return token
    },
    async generateTokens(payload: string) {
    
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || '123', {expiresIn: '10s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '1234', {expiresIn: '20s'})

        return {
            accessToken,
            refreshToken
        }
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