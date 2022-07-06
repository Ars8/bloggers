import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {body, validationResult} from "express-validator";
import {bloggersService} from "../domain/bloggers-service";

export const usersRouter = Router({})

export const userLoginValidation = body('login')
    .exists().withMessage('incorrect login')
    .trim().notEmpty().withMessage('incorrect login')
    .isString().withMessage('incorrect login')
    .isLength({ min: 3, max: 10 }).withMessage('incorrect login')

export const userPasswordValidation = body('password')
    .exists().withMessage('incorrect password')
    .trim().notEmpty().withMessage('incorrect password')
    .isString().withMessage('incorrect password')
    .isLength({ min: 6, max: 20 }).withMessage('incorrect password')

export const validationUserLogin = body('login').custom(async login => {
    return await usersService.findUserByLogin(login).then(function(user) {
            if (!user) {
                throw new Error('this login is already in use')
            }
        }
    )
}).withMessage('incorrect login')

usersRouter.get('/', async(req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const users = await usersService.getAllUsers(PageNumber, PageSize)
    res.status(200).send(users)
})
usersRouter.post('/', userLoginValidation, userPasswordValidation, validationUserLogin, async(req: Request, res: Response) => {

    const err = validationResult(req)
    const errors = err.array({ onlyFirstError: true }).map(elem => {
        return {
            message: elem.msg,
            field: elem.param,
        }
    })
    if (!err.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors })
    }

    const user = await usersService.createUser(req.body.login, req.body.password)
    return res.status(201).send(user)
})