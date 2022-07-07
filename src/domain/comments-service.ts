import {CommentDBType} from "../repositories/types"
import {commentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {postsRepository} from "../repositories/posts-repository";

export const commentsService = {
    async findCommentById(id: ObjectId): Promise<CommentDBType | null> {
        return commentsRepository.findCommentById(id)
    },
    async updateComment(commentId: ObjectId, comment: string): Promise<boolean> {
        return await commentsRepository.updateComment(commentId, comment)
    },
}