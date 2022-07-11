import {commentsCollection} from "./db"
import {CommentDBType} from "./types"

export const commentsRepository = {
    async findCommentById(id: string): Promise<CommentDBType | null> {
        let comment: CommentDBType | null = await commentsCollection.findOne({id: id})
        return comment
    },
    async findPostComments(id: string, pageNumber: number, pageSize: number): Promise<any> {
        const skip = (pageNumber - 1) * pageSize
        let allComments = await commentsCollection.find({postId: id}).toArray()
        let pagesCount = allComments.length / pageSize
        let comments = await commentsCollection.find({postId: id}, {projection: {_id: 0}}).skip(skip).limit(pageSize).toArray()
        let allCount = await commentsCollection.countDocuments({postId: id})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allCount,
            items: comments
        }
    },
    async createComment(newComment: CommentDBType): Promise<CommentDBType> {
        const result = await commentsCollection.insertOne({...newComment})
        return newComment
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
    async delete(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
