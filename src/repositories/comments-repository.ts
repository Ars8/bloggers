import {commentsCollection} from "./db"
import {CommentDBType} from "./types"
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async findCommentById(id: ObjectId): Promise<CommentDBType | null> {
        let post: CommentDBType | null = await commentsCollection.findOne({_id: id})
        return post
    },
}
