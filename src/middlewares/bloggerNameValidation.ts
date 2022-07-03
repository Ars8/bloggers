import { body, check, validationResult } from 'express-validator'
import {NextFunction, Request, Response, Router} from "express"

const URL_REGEX = new RegExp("^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")

export const bloggerNameValidation = (req: Request, res: Response, next: NextFunction) => {
        check('name', 'Incorrect name')
            .exists()
            .trim()
            .notEmpty()
            .isString()
            .isLength({
                max: 15,
            })
            .custom((value) => value !== 'name'),
        check('youtubeUrl', 'Incorrect youtubeUrl')
            .exists()
            .trim()
            .notEmpty()
            .isString()
            .isLength({
                max: 100,
            })
            .matches(URL_REGEX)

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param,
            }
        },
    })

    const errors = myValidationResult(req).array()
    if (errors.length > 0 || !req.body.name) {
        return res.status(400).send({ errorsMessages: errors })
    } else {
        next()
    }
}
