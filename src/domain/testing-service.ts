import { testingRepository } from "../repositories/testing-repository";

export const testingService = {
    async deleteAll(): Promise<void> {
        return await testingRepository.delete()
    },
}