import {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import { body } from 'express-validator';

const express = require('express')
const app = express()
const port = process.env.PORT || 5000

interface blogger {
    id: number,
    name: string,
    youtubeUrl: string
}

interface post {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName?: string
}

const validations = [
    body('title', {
        errorsMessages: [
            {
                message: "incorrect title",
                field: "title"
            }
        ]
    })
        .isEmpty()
        .isLength({
            max: 40,
        })
        .rtrim(),
    body('shortDescription', {
        errorsMessages: [
            {
                message: "incorrect shortDescription",
                field: "shortDescription"
            }
        ]
    })
        .isEmpty()
        .isLength({
            max: 100,
        })
        .rtrim(),
    body('content', {
        errorsMessages: [
            {
                message: "incorrect content",
                field: "content"
            }
        ]
    })
        .isEmpty()
        .isLength({
            max: 1000,
        })
        .rtrim(),
];

let bloggers: blogger[] = [
    {id: 1, name: 'About JS - 01', youtubeUrl: 'it-incubator.eu'},
]

let posts: post[] = [
    {id: 1, title: 'About', shortDescription: 'About JS - 01', content: 'it-incubator.eu', bloggerId: 1, bloggerName: 'About'},
]

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!')
})
app.get('/bloggers', (req: Request, res: Response) => {
    res.status(200).send(bloggers)
})
app.get('/bloggers/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const blogger = bloggers.find(p => p.id === id)
    if (blogger) {
        res.status(200).send(blogger)
    }else {
        res.send(404)
    }
})
app.post('/bloggers', (req: Request, res: Response) => {
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    if (!name || name == null ||  typeof name !== 'string' || !name.trim() || name.length > 15 || youtubeUrl.length > 100) {
        res.status(400).send({
            errorsMessages: [{
                'message': 'Incorrect name',
                'field': 'name'
            }]
        })
        return
    }else {
        const newBlogger = {
            id: +(new Date()),
            name: req.body.name,
            youtubeUrl: req.body.youtubeUrl
        }
        bloggers.push(newBlogger)
        res.status(201).send(newBlogger)
    }
})
app.put('/bloggers/:id', (req: Request, res: Response) => {
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    if (!name || typeof name !== 'string' || !name.trim() || name.length > 40) {
        res.status(400).send({
            errorsMessages: [
                {
                    'message': 'Incorrect youtubeUrl',
                    'field': 'youtubeUrl'
                },
                {
                    'message': 'Incorrect name',
                    'field': 'name'
                }
            ]
        })
        return
    }
    const id = +req.params.id
    const blogger = bloggers.find(item => item.id === id)
    if (blogger) {
        blogger.name = name
        blogger.youtubeUrl = youtubeUrl
        res.status(204).send(bloggers)
    } else {
        res.send(404)
    }
})
app.delete('/bloggers/:id', (req: Request, res: Response) => {
    const id = +req.params.id

    if (!id) {
        res.status(404)
    }

    const newBloggers = bloggers.filter(item => { return item.id !== id })

    if (newBloggers.length < bloggers.length) {
        bloggers = newBloggers
        res.send(204)
    } else {
        res.send(404)
    }
})

app.get('/posts', (req: Request, res: Response) => {
    res.status(200).send(posts)
})
app.get('/posts/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if(typeof id !== 'number') {
        res.send(400)
        return
    }
    const post = posts.find(p => p.id === id)
    if (post) {
        res.status(200).send(post)
    }else {
        res.send(404)
    }
})
app.post('/posts', body('title').isEmpty(), (req: Request, res: Response) => {
    let title = req.body.title
    let shortDescription = req.body.shortDescription
    let content = req.body.content

    if (!title || title == null ||  typeof title !== 'string' || !title.trim() || title.length > 30 || shortDescription.length > 100 || content.length > 1000) {
        res.status(400).send({
            errorsMessages: [{
                'message': 'Incorrect shortDescription',
                'field': 'shortDescription'
            },
                {
                    'message': 'Incorrect name',
                    'field': 'title'
                }]
        })
        return
    }else {
        const newPost = {
            bloggerId: 1,
            bloggerName: req.body.title,
            id: +(new Date()),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content
        }
        posts.push(newPost)
        res.status(201).send(newPost)
    }
})
app.put('/posts/:id', validations, (req: Request, res: Response) => {
    let title = req.body.title
    let shortDescription = req.body.shortDescription
    let content = req.body.content
    let bloggerId = req.body.bloggerId

    const id = +req.params.id
    const post = posts.find(item => item.id === id)
    if (post) {
        post.title = title,
        post.shortDescription = shortDescription,
        post.content = content,
        post.bloggerId = bloggerId,
        res.status(204).send(posts)
    } else {
        res.send(404)
    }
})
app.delete('/posts/:id', (req: Request, res: Response) => {
    const id = +req.params.id

    if (!id) {
        res.status(404)
    }

    const newPosts = posts.filter(item => { return item.id !== id })

    if (newPosts.length < posts.length) {
        posts = newPosts
        res.send(204)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})