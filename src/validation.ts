import { body } from 'express-validator';

export const validations = [
    body('title', 'Incorrect title')
        .isEmpty()
        .withMessage('Incorrect title')
        .isLength({
            max: 30,
        })
        .withMessage('Incorrect shortDescription'),
    body('shortDescription', 'Incorrect shortDescription')
        .isEmpty()
        .withMessage('Incorrect shortDescription')
        .isLength({
            max: 100,
        })
        .withMessage('Incorrect title'),
    body('content', 'Incorrect content')
        .isEmpty()
        .withMessage('Incorrect content')
        .isLength({
            max: 1000,
        })
        .withMessage('Incorrect title'),
];
