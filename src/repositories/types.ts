import {ObjectId} from "mongodb";

export type BloggerDBType = {
    id: number
    name: string
    youtubeUrl: string
}

export type PostDBType = {
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName?: string | null | undefined
}

export type UserDBType = {
    _id: ObjectId
    login: string
    passwordHash: string
    passwordSalt: string
    createdAt: Date
}

export type CommentDBType = {
    _id: ObjectId
    content: string
    userId: string
    userLogin: string
    addedAt: Date
}