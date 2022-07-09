import {commentsCollection, postsCollection} from "./db"
import {CommentDBType} from "./types"
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async findCommentById(id: string): Promise<CommentDBType | null> {
        let comment: CommentDBType | null = await commentsCollection.findOne({id: id})
        return comment
    },
    async updateComment(commentId: string, comment: string): Promise<boolean> {
        const result = await commentsCollection.updateOne(
            {id: commentId},
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
