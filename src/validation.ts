import { body } from 'express-validator';

export const validations = [
    body('title', {
        errorsMessages: [
            {
                message: "incorrect title",
                field: "title"
            }
        ]
    })
        .isEmpty()
        .isLength({
            max: 40,
        })
        .rtrim(),
    body('shortDescription', {
        errorsMessages: [
            {
                message: "incorrect shortDescription",
                field: "shortDescription"
            }
        ]
    })
        .isEmpty()
        .isLength({
            max: 100,
        })
        .rtrim(),
    body('content', {
        errorsMessages: [
            {
                message: "incorrect content",
                field: "content"
            }
        ]
    })
        .isEmpty()
        .isLength({
            max: 1000,
        })
        .rtrim(),
];
