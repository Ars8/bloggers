import {ObjectId, WithId} from "mongodb";

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
    email: string
    passwordHash: string
    passwordSalt: string
    createdAt: Date
}

export type CommentDBType = {
    id: string
    content: string
    postId?: string
    userId: string | undefined
    userLogin: string | undefined
    addedAt: Date
}

export type UserAccountDBType = {
    id: string
    accountData: UserAccountType
    emailConfirmation: EmailConfirmationType
}

export type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
    sentEmails?: SentEmailType[]
}

export type UserAccountType = {
    login: string
    email: string
    passwordHash: string
    passwordSalt: string
    createdAt: Date
}

export type RegistrationDataType = {
    ip: string
}

export type SentEmailType = {
    sentDate: Date
}

export type UserDtoType = {
    id: string
    email: UserAccountType['email']
    isConfirmed: EmailConfirmationType['isConfirmed']
}