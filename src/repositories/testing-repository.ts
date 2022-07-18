import {bloggersCollection, commentsCollection, postsCollection, usersCollection} from "./db";

export const testingRepository = {
    async delete(): Promise<void> {
        await usersCollection.deleteMany({})
        await bloggersCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await commentsCollection.deleteMany({})
    }
}