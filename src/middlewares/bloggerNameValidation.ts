import {body, validationResult} from "express-validator";

export const bloggerNameValidation = body('name', 'Incorrect name')
            .exists()
            .trim()
            .notEmpty()
            .isString()
            .isLength({
                    max: 15,
            })

export const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param,
        }
    },
})
