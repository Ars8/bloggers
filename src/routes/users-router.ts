import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {body, validationResult} from "express-validator";
import {bloggersService} from "../domain/bloggers-service";
import {authTokenMiddleware} from "../middlewares/authTokenMiddleware";
import {postsService} from "../domain/posts-service";
import {postsRouter} from "./posts-router";
import {ObjectId} from "mongodb";

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
            if (user) {
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
    const newUser = {
        id: user._id,
        login: user.login
    }
    return res.status(201).send(newUser)
})
usersRouter.delete('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    const id = new ObjectId(req.params.id)
    const isDeleted = await usersService.deleteUser(id)

    if (isDeleted) {
        return res.send(204)
    } else {
        return res.send(404)
    }
})