import {tokensCollection} from "./db";

export const tokensRepository = {
    async saveToken(id: string, refreshToken: string) {
        const tokenData = await tokensCollection.findOne({id: id}, {projection: {_id: 0}})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return
        }
        await tokensCollection.insertOne({id: id, refreshToken})
        return {id, refreshToken}
    },
    async findRefreshToken(refreshToken: string) {
        const tokenData = await tokensCollection.findOne({refreshToken: refreshToken}, {projection: {_id: 0}})
        
        return tokenData
    },
    async deleteRefreshToken(refreshToken: string) {
        const tokenData = await tokensCollection.deleteOne({refreshToken: refreshToken})
        return tokenData.deletedCount === 1
    },
}
