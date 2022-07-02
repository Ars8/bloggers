import { body, validationResult } from 'express-validator'
import {NextFunction, Request, Response, Router} from "express"


export const postsValidation = (req: Request, res: Response, next: NextFunction) => {
    [
        body('title', 'Incorrect title')
            .exists()
            .trim()
            .notEmpty()
            .isString()
            .isLength({
                max: 30,
            }),
        body('shortDescription', 'Incorrect shortDescription')
            .exists()
            .trim()
            .notEmpty()
            .isString()
            .isLength({
                max: 100,
            }),
        body('content', 'Incorrect content')
            .exists()
            .trim()
            .notEmpty()
            .isString()
            .isLength({
                max: 1000,
            }),
    ]

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param,
            }
        },
    })

    const errors = myValidationResult(req).array()
    if (errors.length > 0) {
        return res.status(400).send({ errorsMessages: errors })
    } else {
        next()
    }
}
