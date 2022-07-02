import {body, validationResult} from "express-validator";

const URL_REGEX = new RegExp("^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")

export const bloggerNameValidation = [
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
        .matches(URL_REGEX),
]
