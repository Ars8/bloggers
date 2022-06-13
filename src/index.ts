import {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";

const express = require('express')
const app = express()
const port = process.env.PORT || 5000

interface bloggers {
    id: number,
    name: string,
    youtubeUrl: string
}

let bloggers: bloggers[] = [
    {id: 1, name: 'About JS - 01', youtubeUrl: 'it-incubator.eu'},
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
    if (!name || typeof name !== 'string' || !name.trim() || name.length > 15) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Incorrect name",
                    field: "name"
                }
            ]
        })
        return
    }
    const newBlogger = {
        id: +(new Date()),
        name: name,
        youtubeUrl: youtubeUrl
    }
    bloggers.push(newBlogger)
    res.status(201).send(bloggers)
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
        blogger.name = name,
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})