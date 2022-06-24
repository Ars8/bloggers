import express, {Request, Response, NextFunction} from 'express';
import bodyParser from "body-parser";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";

const app = express()

const authTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === 'Basic YWRtaW46cXdlcnR5') {
        next()
    } else {
        res.send(401)
    }
}

const port = process.env.PORT || 5000

const parserMiddleware = bodyParser({})

app.use(parserMiddleware)
app.use(authTokenMiddleware)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()