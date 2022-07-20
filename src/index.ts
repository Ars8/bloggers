import express, {Request, Response, NextFunction} from 'express';
import bodyParser from "body-parser";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import { testingRouter } from './routes/testing-router';

const app = express()
app.set('trust proxy', true)
app.enable('trust proxy')

const port = process.env.PORT || 5000

const parserMiddleware = bodyParser.json()

app.use(parserMiddleware)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()