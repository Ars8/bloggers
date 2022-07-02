import {body, validationResult} from "express-validator";

const URL_REGEX = new RegExp("^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")

export const bloggerYTValidation = body('youtubeUrl', 'Incorrect youtubeUrl')
        .exists()
        .trim()
        .notEmpty()
        .isString()
        .isLength({
            max: 100,
        })
        .matches(URL_REGEX)

export const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param,
        }
    },
})
