import { body, validationResult } from 'express-validator'
import { NextFunction, Request, Response, Router } from "express"

const URL_REGEX = new RegExp("^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")

export const bloggerNameValidation = (req: Request, res: Response, next: NextFunction) => {
    body('name', 'Incorrect name')
        .exists()
        .trim()
        .notEmpty()
        .isString()
        .isLength({
            max: 15,
        }),
        body('youtubeUrl', 'Incorrect youtubeUrl')
            .exists()
            .trim()
            .notEmpty()
            .isString()
            .isLength({
                max: 100,
            })
            .matches(URL_REGEX)

    const err = validationResult(req)
    const errors = err.array({ onlyFirstError: true }).map(elem => {
        return {
            message: elem.msg,
            field: elem.param,
        }
    })
    if (!err.isEmpty()) {
        res.status(400).json({ errorsMessages: errors })
    } else {
        next()
    }
}
