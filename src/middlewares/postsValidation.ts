import {body, param, validationResult} from "express-validator";

export const postsValidation = [
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
    param('bloggerId', 'Incorrect bloggerId')
        .exists(),
];

export const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param,
        }
    },
})
