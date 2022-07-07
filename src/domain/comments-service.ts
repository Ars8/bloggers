import {CommentDBType} from "../repositories/types"
import {commentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";

export const commentsService = {
    async findCommentById(id: ObjectId): Promise<CommentDBType | null> {
        return commentsRepository.findCommentById(id)
    },
}