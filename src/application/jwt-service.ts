import {UserAccountDBType, UserDBType, UserDtoType} from "../repositories/types"
import jwt from 'jsonwebtoken'
import { tokensRepository } from "../repositories/tokens-repository"

export const jwtService = {
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123')
            return result.userId
        } catch (error) {
            return null
        }
    },
    async generateTokens(payload: string) {
    
        const accessToken = jwt.sign({payload}, process.env.JWT_ACCESS_SECRET || '123', {expiresIn: '10s'})
        const refreshToken = jwt.sign({payload}, process.env.JWT_REFRESH_SECRET || '1234', {expiresIn: '20s'})

        return {
            accessToken,
            refreshToken
        }
    },
    async saveToken(userId: string, refreshToken: string) {
        await tokensRepository.saveToken(userId, refreshToken)
    },
    async validateRefreshToken(token: string) {
        try {
            const userData: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET || '1234');
            console.log(userData, 'userData', Date.now());
            return userData;
        } catch (error) {
            return null;
        }
    },
    async findToken(refreshToken: string) {
        const tokenData = await tokensRepository.findRefreshToken(refreshToken)
        return tokenData;
    },
    async removeToken(refreshToken: string) {
        const tokenData = await tokensRepository.deleteRefreshToken(refreshToken)
        return tokenData;
    }
}