import {db} from "./db";

export const testingRepository = {
    async delete(): Promise<void> {
        const result = await db.dropDatabase()
    }
}