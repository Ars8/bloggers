import {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";

const express = require('express')
const app = express()
const port = process.env.PORT || 5000

let bloggers = [
    {id: 1, name: 'About JS - 01', youtubeUrl: 'it-incubator.eu'},
    {id: 2, name: 'About JS - 02', youtubeUrl: 'it-incubator.eu'},
    {id: 3, name: 'About JS - 03', youtubeUrl: 'it-incubator.eu'},
    {id: 4, name: 'About JS - 04', youtubeUrl: 'it-incubator.eu'},
    {id: 5, name: 'About JS - 05', youtubeUrl: 'it-incubator.eu'},
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
    const id = +req.params.videoId
    const blogger = bloggers.find(p => p.id === id)
    if (blogger) {
        res.status(200).send(blogger)
    }else {
        res.send(404)
    }
})
app.post('/bloggers', (req: Request, res: Response) => {
    let name = req.body.title
    if (!name || name == null ||  typeof name !== 'string' || !name.trim() || name.length > 40) {
        res.status(400).send({
            errorsMessages: [{
                'message': 'Incorrect title',
                'field': 'title'
            }]
        })
        return
    }
    const newBlogger = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: 'it-incubator.eu'
    }
    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
})
app.put('/bloggers/:id', (req: Request, res: Response) => {
    let name = req.body.name
    if (!name || name == null || typeof name !== 'string' || !name.trim() || name.length > 40) {
        res.status(400).send({
            errorsMessages: [{
                message: 'Incorrect title',
                field: 'title'
            }]
        })
        return
    }
    const id = +req.params.videoId
    const blogger = bloggers.find(item => item.id === id)
    if (blogger) {
        blogger.name = name
        res.status(204).send(bloggers)
    } else {
        res.send(404)
    }
})
app.delete('/bloggers/:id', (req: Request, res: Response) => {
    const id = +req.params.videoId
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