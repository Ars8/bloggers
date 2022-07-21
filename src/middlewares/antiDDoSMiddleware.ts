import {NextFunction, Request, Response} from "express";

type HackerType = {
    ip: string
    url: string
    date: number
}

let arr: HackerType[] = []

export const antiDDoSMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip + '[' + req.headers['x-forwarded-for'] + ']'

    const url = '[' + req.method + ']' + req.originalUrl

    const hackerArr = arr.filter(h => h.ip === ip && h.url === url && h.date > Date.now() - 10 * 1000)

    if (hackerArr.length > 4) {
        res.status(429).json({hackerArr})
        return
    }

    arr = [
        ...arr.filter(h => h.date > Date.now() - 10 * 1000),
        {
            date: Date.now(),
            ip,
            url
        },
    ]

    /* res.status(204).json({hackerArr})
    return */

    next()
}