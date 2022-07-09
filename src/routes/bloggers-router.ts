import { Request, Response, Router } from "express";
import { bloggersService } from "../domain/bloggers-service";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import { postsService } from "../domain/posts-service";
import { bloggersRepository } from "../repositories/bloggers-repository";
import { body, validationResult } from 'express-validator'
import { postsContentValidation, postsSDValidation, postsTitleValidation } from "./posts-router";

export const bloggersRouter = Router({})
const URL_REGEX = new RegExp("^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")

const bloggerNamValidation = body('name')
    .exists().withMessage('incorrect name')
    .trim().notEmpty().withMessage('incorrect name')
    .isString().withMessage('incorrect name')
    .isLength({ max: 15 }).withMessage('incorrect name')

const bloggerYTValidation = body('youtubeUrl')
    .exists().withMessage('incorrect youtubeUrl')
    .trim().notEmpty().withMessage('incorrect youtubeUrl')
    .isString().withMessage('incorrect youtubeUrl')
    .isLength({ max: 100 }).withMessage('incorrect youtubeUrl')
    .matches(URL_REGEX).withMessage('incorrect youtubeUrl')


bloggersRouter.get('/', async (req: Request, res: Response) => {
    let page = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    let SearchNameTerm = req.query.SearchNameTerm ? req.query.SearchNameTerm.toString() : null
    const foundBloggers = await bloggersService.findBloggers(SearchNameTerm, page, PageSize)

    res.send(foundBloggers)
})
bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const blogger = await bloggersService.findBloggerById(req.params.id)
    if (blogger) {
        return res.status(200).send(blogger)
    } else {
        return res.send(404)
    }
})
bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const bloggerId = req.params.bloggerId
    const isBloggerId = await bloggersRepository.findBloggerById(bloggerId)

    if (isBloggerId) {
        const bloggerPosts = await bloggersService.findBloggerPosts(bloggerId, PageNumber, PageSize)
        return res.send(bloggerPosts)
    } else {
        return res.send(404)
    }
})
bloggersRouter.post('/',
    authTokenMiddleware,
    bloggerNamValidation,
    bloggerYTValidation,
    async (req: Request, res: Response) => {
        const name = req.body.name
        const youtubeUrl = req.body.youtubeUrl

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

        const newBlogger = await bloggersService.createBlogger(name, youtubeUrl)
        return res.status(201).send(newBlogger)

    })
bloggersRouter.post('/:bloggerId/posts', authTokenMiddleware, postsTitleValidation, postsSDValidation, postsContentValidation, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = req.params.bloggerId

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

    if (!isBloggerId) {
        return res.send(404)
    }

    const newPostBlogger = await postsService.createPost(title, shortDescription, content, bloggerId, bloggerName)
    return res.status(201).send(newPostBlogger)

})
bloggersRouter.put('/:id', authTokenMiddleware, bloggerNamValidation, bloggerYTValidation, async (req: Request, res: Response) => {
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl
    const id = req.params.id

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

    const isUpdated = await bloggersService.updateBlogger(id, name, youtubeUrl)
    if (isUpdated) {
        return res.send(204)
    } else {
        return res.send(404)
    }
})
bloggersRouter.delete('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id
    const isDeleted = await bloggersService.deleteBlogger(id)

    if (isDeleted) {
        return res.send(204)
    } else {
        return res.send(404)
    }
})
