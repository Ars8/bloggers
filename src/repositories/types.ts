export type BloggerDBType = {
    name: string
    youtubeUrl: string
}

export type PostDBType = {
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName?: string
}