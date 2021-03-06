import {UserAccountDBType, UserDBType} from "../repositories/types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserAccountDBType | null
        }
    }
}