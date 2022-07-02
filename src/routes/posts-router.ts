import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {authTokenMiddleware} from "../middlewares/authTokenMiddleware";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {bloggersService} from "../domain/bloggers-service";
import {postsValidation} from "../middlewares/postsValidation";
import {myValidationResult} from "../middlewares/bloggerValidation";

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
        return res.status(200).send(post)
    }else {
        return res.send(404)
    }
})
postsRouter.post('/', authTokenMiddleware, postsValidation, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.body.bloggerId
    const isBloggerId = await bloggersRepository.findBloggerById(bloggerId)
    const bloggerName = isBloggerId ? isBloggerId.name : undefined

    const errors = myValidationResult(req).array()
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors })
    }
    if (bloggerId) {
        const newPost = await postsService.createPost(title, shortDescription, content, bloggerId, bloggerName)
        return res.status(201).send(newPost)
    }

})
postsRouter.put('/:id', authTokenMiddleware, postsValidation, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.body.bloggerId
    const id = +req.params.id

    const isBloggerId = await bloggersRepository.findBloggerById(bloggerId)

    if (!isBloggerId) {
        return res.send(404)
    }

    const errors = myValidationResult(req).array()
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors })
    } else {
        const isBloggerId = await bloggersRepository.findBloggerById(bloggerId)
        const bloggerName = isBloggerId ? isBloggerId.name : undefined
        const isUpdated = await postsService.updatePost(id,title,shortDescription, content, bloggerId, bloggerName)
        if (isUpdated) {
            return res.send(204)
        } else {
            return res.send(404)
        }
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
