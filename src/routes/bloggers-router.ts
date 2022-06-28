import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {authTokenMiddleware} from "../middlewares/authTokenMiddleware";
import {postsService} from "../domain/posts-service";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {bloggersCollection} from "../repositories/db";

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request, res: Response) => {
    let page = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const foundBloggers = await bloggersService.findBloggers(req.query.SearchNameTerm?.toString(), page, PageSize)

    res.send(foundBloggers)
})
bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const blogger = await bloggersService.findBloggerById(+req.params.id)
    if (blogger) {
        res.status(200).send(blogger)
    }else {
        res.send(404)
    }
})
bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined
    let PageSize = req.query.PageSize ? +req.query.PageSize : undefined
    const bloggerId = +req.params.bloggerId
    const isBloggerId = await bloggersRepository.findBloggerById(bloggerId)

    if (isBloggerId) {
        const bloggerPosts = await bloggersService.findBloggerPosts(bloggerId)
        res.status(200).send({
            "pagesCount": PageNumber,
            "page": PageNumber,
            "pageSize": PageSize,
            "totalCount": PageSize,
            "items": {...bloggerPosts}
        })
    }else {
        res.send(404)
    }
})
bloggersRouter.post('/', authTokenMiddleware, async (req: Request, res: Response) => {
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl
    const regEx = new RegExp('^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
    const found = regEx.test(youtubeUrl)

    let errors = []

    if (!name || typeof name !== 'string' || !name.trim() || name.length > 15) {
        errors.push({
            message: "Incorrect nam",
            field: "name"
        })
    }

    if (!youtubeUrl || typeof youtubeUrl !== 'string' || !youtubeUrl.trim() || youtubeUrl.length > 100 || !found) {
        errors.push({
            message: "Incorrect youtubeUrl",
            field: "youtubeUrl"
        })
    }

    if (errors.length > 0) {
        res.status(400).send({errorsMessages: errors})
    } else {
        const newBlogger = await bloggersService.createBlogger(name, youtubeUrl)
        res.status(201).send(newBlogger)
    }
})
bloggersRouter.post('/:bloggerId/posts', authTokenMiddleware, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.params.bloggerId


    let errors = []

    if (title === null || !title || typeof title !== 'string' || !title.trim() || title.length > 30) {
        errors.push({
            message: "string",
            field: "title"
        })
    }

    if (shortDescription ===null || !shortDescription || typeof shortDescription !== 'string' || !shortDescription.trim() || shortDescription.length > 100) {
        errors.push({
            message: "Invalid shortDescription",
            field: "shortDescription"
        })
    }

    if (content === null || !content || typeof content !== 'string' || !content.trim() || content.length > 1000) {
        errors.push({
            message: "Invalid content!",
            field: "content"
        })
    }

    const isBloggerId = await bloggersRepository.findBloggerById(bloggerId)
    const bloggerName = isBloggerId ? isBloggerId.name : undefined

    if (!isBloggerId) {
        errors.push({
            message: "Invalid bloggerId!",
            field: "bloggerId"
        })
        res.status(404).send({errorsMessages: errors})
        return
    }

    if (errors.length > 0) {
        res.status(400).send({errorsMessages: errors})
        return
    }

    const newPostBlogger = await postsService.createPost(title, shortDescription, content, bloggerId, bloggerName)
    res.status(201).send(newPostBlogger)
})
bloggersRouter.put('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl

    const regEx = new RegExp('^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
    const found = regEx.test(youtubeUrl)

    let errors = []

    if (!name || typeof name !== 'string' || !name.trim() || name.length > 15) {
        errors.push({
            message: "Incorrect name",
            field: "name"
        })
    }

    if (!youtubeUrl || typeof youtubeUrl !== 'string' || !youtubeUrl.trim() || youtubeUrl.length > 100 || !found) {
        errors.push({
            message: "Incorrect youtubeUrl",
            field: "youtubeUrl"
        })
    }

    if (errors.length > 0) {
        res.status(400).send({errorsMessages: errors})
    } else {
        const id = +req.params.id
        const isUpdated = await bloggersService.updateBlogger(id, name, youtubeUrl)
        if (isUpdated) {
            const blogger = await bloggersService.findBloggerById(id)
            res.status(204).send(blogger)
        } else {
            res.send(404)
        }
    }
})
bloggersRouter.delete('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    const id = +req.params.id
    const isDeleted = await bloggersService.deleteBlogger(id)

    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})
