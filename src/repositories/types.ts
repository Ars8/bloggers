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
    bloggerName?: string
}