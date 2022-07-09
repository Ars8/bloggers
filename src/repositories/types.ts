import {ObjectId} from "mongodb";

export type BloggerDBType = {
    id: string
    name: string
    youtubeUrl: string
}

export type PostDBType = {
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName?: string | null | undefined
}

export type UserDBType = {
    id: string
    login: string
    passwordHash: string
    passwordSalt: string
    createdAt: Date
}

export type CommentDBType = {
    id: string
    content: string
    userId: string
    userLogin: string
    addedAt: Date
}