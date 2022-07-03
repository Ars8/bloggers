import { Request, Response, Router } from "express";
import { postsService } from "../domain/posts-service";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import { bloggersRepository } from "../repositories/bloggers-repository";
import { postsValidation } from "../middlewares/postsValidation";
import { postsRepository } from "../repositories/posts-repository";
import { body, param, validationResult } from 'express-validator'
import { bloggersService } from "../domain/bloggers-service";

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

export const validationBloggerId = body('bloggerId').toInt().custom(bloggerId => {
        const blogger = bloggersService.findBloggerById(bloggerId)
        return blogger
    }).withMessage('incorrect bloggerId')

export const validationPostsId = param('id').toInt().custom( id => {
    const post = postsService.findPostById(id)
    return (post)
}).withMessage('incorrect postId')

postsRouter.get('/', async (req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const foundPosts = await postsService.findPosts(PageNumber, PageSize)

    res.send(foundPosts)
})
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const post = await postsService.findPostById(+req.params.id)
    if (post) {
        return res.status(200).send(post)
    } else {
        res.send(404)
    }
})
postsRouter.post('/', authTokenMiddleware, postsTitleValidation, postsSDValidation, postsContentValidation, validationBloggerId, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.body.bloggerId

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
postsRouter.put('/:id', authTokenMiddleware, postsTitleValidation, postsSDValidation, postsContentValidation, validationBloggerId, validationPostsId, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.body.bloggerId
    const id = +req.params.id

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
    const isPostsId = await postsRepository.findPostById(id)

    if (!isBloggerId || !isPostsId) {
        return res.send(404)
    }

    const bloggerName = isBloggerId ? isBloggerId.name : undefined
    const isUpdated = await postsService.updatePost(id, title, shortDescription, content, bloggerId, bloggerName)
    if (isUpdated) {
        return res.send(204)
    }

})
postsRouter.delete('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    const id = +req.params.id
    const isDeleted = await postsService.deletePost(id)

    if (isDeleted) {
        return res.send(204)
    } else {
        return res.send(404)
    }
})
