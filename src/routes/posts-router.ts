import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {authTokenMiddleware} from "../middlewares/authTokenMiddleware";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {bloggersService} from "../domain/bloggers-service";

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const foundPosts = await postsService.findPosts(PageNumber, PageSize)

    res.send(foundPosts)
})
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const post = await postsService.findPostById(+req.params.id)
    if (post) {
        res.status(200).send(post)
    }else {
        res.send(404)
    }
})
postsRouter.post('/', authTokenMiddleware, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.body.bloggerId

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
        return
    }

    if (errors.length > 0) {
        res.status(400).send({errorsMessages: errors})
        return
    }
    const newPost = await postsService.createPost(title, shortDescription, content, bloggerId, bloggerName)
    res.status(201).send(newPost)
})
postsRouter.put('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.body.bloggerId
    const bloggerName = req.body.bloggerName

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

    if (!isBloggerId) {
        errors.push({
            message: "Invalid bloggerId!",
            field: "bloggerId"
        })
    }

    if (errors.length > 0) {
        res.status(400).send({errorsMessages: errors})
    } else {
        const id = +req.params.id
        const isUpdated = await postsService.updatePost(id,title,shortDescription, content, bloggerId, bloggerName)
        if (isUpdated) {
            const post = await postsService.findPostById(id)
            res.status(204).send(post)
        } else {
            res.send(404)
        }
    }
})
postsRouter.delete('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    const id = +req.params.id
    const isDeleted = await postsService.deletePost(id)

    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})
