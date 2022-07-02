import {param, validationResult} from "express-validator";

const URL_REGEX = new RegExp("^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")

export const bloggerIdValidation = [
    param('id', 'Incorrect id')
        .exists()
        .isInt({
            min: 1
        }),
];

export const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param,
        }
    },
})