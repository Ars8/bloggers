import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {body, validationResult} from "express-validator";
import {authMiddleware} from "../middlewares/authMiddleware";

export const commentsRouter = Router({})

export const commentsContentValidation = body('content')
    .exists().withMessage('incorrect content')
    .trim().notEmpty().withMessage('incorrect content')
    .isString().withMessage('incorrect content')
    .isLength({ min: 20, max: 300 }).withMessage('incorrect content')

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentsService.findCommentById(req.params.id)
    if (comment) {
        return res.status(200).send({
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt,
        })
    } else {
        res.send(404)
    }
})
commentsRouter.put('/:commentId', authMiddleware, commentsContentValidation, async (req: Request, res: Response) => {

    const err = validationResult(req)
    const errors = err.array({ onlyFirstError: true }).map(elem => {
        return {
            message: elem.msg,
            field: elem.param,
        }
    })
    if (!err.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors })
    }

    const comment = req.body.content
    const commentId = req.params.commentId
    const userIdFromReq = req.user?.id
    const userIdFromDBComment = await commentsService.findCommentById(commentId)

    if (!userIdFromDBComment) {
        return res.send(404)
    }

    if (userIdFromReq !== userIdFromDBComment?.userId) {
        return res.send(403)
    }

    const isUpdated = await commentsService.updateComment(commentId, comment)
    if (isUpdated) {
        return res.send(204)
    }

})
commentsRouter.delete('/:commentId', authMiddleware, async (req: Request, res: Response) => {
    const id = req.params.commentId

    const userIdFromReq = req.user?.id
    const commentId = req.params.commentId
    const userIdFromDBComment = await commentsService.findCommentById(commentId)

    if (userIdFromReq !== userIdFromDBComment?.userId) {
        return res.send(403)
    }

    const isDeleted = await commentsService.deleteComment(id)

    if (isDeleted) {
        return res.send(204)
    } else {
        return res.send(404)
    }
})