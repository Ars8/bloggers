import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {body, validationResult} from "express-validator";
import {authTokenMiddleware} from "../middlewares/authTokenMiddleware";

export const usersRouter = Router({})
const EMAIL_REGEX = new RegExp("^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$")

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

const userEmailValidation = body('email')
.exists().withMessage('incorrect email')
.trim().notEmpty().withMessage('incorrect email')
.isString().withMessage('incorrect email')
.isEmail().withMessage('Eto email')

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
    return res.status(200).send(users)
})
usersRouter.post('/', authTokenMiddleware, userLoginValidation, userEmailValidation, userPasswordValidation, validationUserLogin, async(req: Request, res: Response) => {

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

    const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    const newUser = {
        id: user.id,
        login: user.accountData.login
    }
    return res.status(201).send(newUser)
})
usersRouter.delete('/:id', authTokenMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id
    const isDeleted = await usersService.deleteUser(id)

    if (isDeleted) {
        return res.send(204)
    } else {
        return res.send(404)
    }
})