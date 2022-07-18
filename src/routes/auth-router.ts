import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {body, validationResult} from "express-validator";
import { emailAdapter } from "../adapters/email-adapter";
import { authService } from "../domain/auth-service";

export const authRouter = Router({})
const EMAIL_REGEX = new RegExp("^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$")

export const usersLoginValidation = body('login')
    .exists().withMessage('incorrect login')
    .trim().notEmpty().withMessage('incorrect login')
    .isString().withMessage('incorrect login')

export const usersPasswordValidation = body('password')
    .exists().withMessage('incorrect password')
    .trim().notEmpty().withMessage('incorrect password')
    .isString().withMessage('incorrect password')

export const codeValidation = body('code')
    .exists().withMessage('incorrect code')
    .trim().notEmpty().withMessage('incorrect code')
    .isString().withMessage('incorrect code')

const userEmailValidation = body('email')
    .exists().withMessage('incorrect email')
    .trim().notEmpty().withMessage('incorrect email')
    .isString().withMessage('incorrect email')
    .matches(EMAIL_REGEX).withMessage('incorrect email')
    

authRouter.post('/registration', usersLoginValidation, userEmailValidation, usersPasswordValidation, async(req: Request, res: Response) => {
    const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
    if (user) {
        res.status(204).send()
    } else {
        res.status(403).send()
    }
})

authRouter.post('/login', usersLoginValidation, usersPasswordValidation, async(req: Request, res: Response) => {

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

    const user = await usersService.checkCredentials(req.body.login, req.body.password)
    if (user) {
        const token = await jwtService.createJWT(user)
        return res.status(200).send({token})
    } else {
        return res.sendStatus(401)
    }
})

authRouter.post('/registration-confirmation', codeValidation, async(req: Request, res: Response) => {
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.status(204).send()
        } else {
            res.send(400)
        }
    }
})

authRouter.post('/resend-registration-code', usersLoginValidation, usersPasswordValidation, async(req: Request, res: Response) => {
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.email)
        if (result) {
            res.status(201).send()
        } else {
            res.send(400)
        }
        return 429
    }
})