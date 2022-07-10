import {CommentDBType} from "../repositories/types"
import {commentsRepository} from "../repositories/comments-repository";

export const commentsService = {
    async findCommentById(id: string): Promise<CommentDBType | null> {
        return commentsRepository.findCommentById(id)
    },
    async findPostComments(id: string, PageNumber: number, PageSize: number): Promise<CommentDBType[]> {
        return commentsRepository.findPostComments(id, PageNumber, PageSize)
    },
    async createComment(postIdFromDB: string | undefined, content: string, userId: string | undefined, userLogin: string | undefined): Promise<CommentDBType | undefined> {
            const newComment: CommentDBType = {
                id: new Date().toString(),
                content: content,
                postId: postIdFromDB,
                userId: userId,
                userLogin: userLogin,
                addedAt: new Date()
            }
            return await commentsRepository.createComment(newComment)
    
    },    
    async updateComment(commentId: string, comment: string): Promise<boolean> {
        return await commentsRepository.updateComment(commentId, comment)
    },
    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.delete(id)
    },
}