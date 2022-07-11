import { Request, Response, Router } from "express";
import { postsService } from "../domain/posts-service";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import { bloggersRepository } from "../repositories/bloggers-repository";
import { postsRepository } from "../repositories/posts-repository";
import { body, param, validationResult } from 'express-validator'
import { bloggersService } from "../domain/bloggers-service";
import {bloggersRouter} from "./bloggers-router";
import { commentsService } from "../domain/comments-service";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commentsContentValidation } from "./comments-router";

export const postsRouter = Router({})

export const postsTitleValidation = body('title')
    .exists().withMessage('incorrect title')
    .trim().notEmpty().withMessage('incorrect title')
    .isString().withMessage('incorrect title')
    .isLength({ max: 30 }).withMessage('incorrect title')

export const postsSDValidation = body('shortDescription')
    .exists().withMessage('incorrect shortDescription')
    .trim().notEmpty().withMessage('incorrect shortDescription')
    .isString().withMessage('incorrect shortDescription')
    .isLength({ max: 100 }).withMessage('incorrect shortDescription')

export const postsContentValidation = body('content')
    .exists().withMessage('incorrect content')
    .trim().notEmpty().withMessage('incorrect content')
    .isString().withMessage('incorrect content')
    .isLength({ max: 1000 }).withMessage('incorrect content')

export const validationBloggerId = body('bloggerId').custom(bloggerId => {
        return bloggersService.findBloggerById(bloggerId).then(function(blogger) {
            if (!blogger) {
                throw new Error('this blogger is already in use')
            }
        }
        )        
    }).withMessage('incorrect bloggerId')

export const validationPostsId = param('id').custom(async (id) => {
    return postsService.findPostById(id).then(function(post) {
        if (!post) {
            throw new Error('this post is already in use')
        }
    }
    ) 
}).withMessage('incorrect postId')

postsRouter.get('/', async (req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const foundPosts = await postsService.findPosts(PageNumber, PageSize)

    res.send(foundPosts)
})
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const post = await postsService.findPostById(req.params.id)
    if (post) {
        return res.status(200).send(post)
    } else {
        res.send(404)
    }
})
postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const postId = req.params.postId
    const isPostId = await postsService.findPostById(postId)

    if (isPostId) {
        const postsComments = await commentsService.findPostComments(postId, PageNumber, PageSize)
        return res.status(200).send(postsComments)
    } else {
        return res.send(404)
    }
})
postsRouter.post('/', authTokenMiddleware, postsTitleValidation, postsSDValidation, postsContentValidation, validationBloggerId, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = req.body.bloggerId

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

    const isBloggerId = await bloggersRepository.findBloggerById(bloggerId)
    const bloggerName = isBloggerId ? isBloggerId.name : undefined

    if (isBloggerId) {
        const newPost = await postsService.createPost(title, shortDescription, content, bloggerId, bloggerName)
        return res.status(201).send(newPost)
    }

})
postsRouter.post('/:postId/comments', authMiddleware, commentsContentValidation, async (req: Request, res: Response) => {
    const content = req.body.content
    const postId = req.params.postId

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

    const isPostId = await postsService.findPostById(postId)
    const postIdFromDB = isPostId?.id
    const userId = req.user?.id
    const userLogin = req.user?.login

    if (!isPostId) {
        return res.send(404)
    }

    if (isPostId) {
        const newCommentPost = await commentsService.createComment(postIdFromDB, content, userId, userLogin)
        const newComment = {
            id: newCommentPost?.id,
            content: newCommentPost?.content,
            userId: newCommentPost?.userId,
            userLogin: newCommentPost?.userLogin,
            addedAt: newCommentPost?.addedAt
        }
        return res.status(201).send(newComment)
    }

})
postsRouter.put('/:id', authTokenMiddleware, postsTitleValidation, postsSDValidation, postsContentValidation, validationBloggerId, validationPostsId, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = req.body.bloggerId
    const id = req.params.id

    const isBloggerId = await bloggersRepository.findBloggerById(bloggerId)
    const isPostsId = await postsRepository.findPostById(id)

    if (!isPostsId) {
        return res.send(404)
    }

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

    const bloggerName = isBloggerId ? isBloggerId.name : undefined
    const isUpdated = await postsService.updatePost(id, title, shortDescription, content, bloggerId, bloggerName)
    if (isUpdated) {
        return res.send(204)
    }

})
postsRouter.delete('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id
    const isDeleted = await postsService.deletePost(id)

    if (isDeleted) {
        return res.send(204)
    } else {
        return res.send(404)
    }
})
