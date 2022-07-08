import {commentsCollection, postsCollection} from "./db"
import {CommentDBType} from "./types"
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async findCommentById(id: ObjectId): Promise<CommentDBType | null> {
        let comment: CommentDBType | null = await commentsCollection.findOne({_id: id})
        return comment
    },
    async updateComment(commentId: ObjectId, comment: string): Promise<boolean> {
        const result = await commentsCollection.updateOne(
            {_id: commentId},
            {
                $set:
                    {
                        content: comment,
                    }
            }
        )
        return result.matchedCount === 1
    },
}
