import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {ObjectId} from "mongodb";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentsService.findCommentById(new ObjectId(req.params.id))
    if (comment) {
        return res.status(200).send({
            id: comment._id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt,
        })
    } else {
        res.send(404)
    }
})