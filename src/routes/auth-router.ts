import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {body, validationResult} from "express-validator";
import { authService } from "../domain/auth-service";
import { emailsManager } from "../managers/email-manager";

export const authRouter = Router({})

export const usersLoginValidation = body('login')
    .exists().withMessage('incorrect login')
    .trim().notEmpty().withMessage('incorrect login')
    .isString().withMessage('incorrect login')
    .custom(async login => {
        return await authService.checkLogin(login).then(function(login) {
            if (login) {
                throw new Error('this login is already in use')
            }
        }
        )        
    }).withMessage('this login is already in use')

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
    .isEmail().withMessage('Eto email')
    .custom(async email => {
        return await authService.checkEmail(email).then(function(email) {
            if (email) {
                throw new Error('this email is already in use')
            }
        }
        )        
    }).withMessage('this email is already in use')

const EmailValidation = body('email')
    .exists().withMessage('incorrect email')
    .trim().notEmpty().withMessage('incorrect email')
    .isString().withMessage('incorrect email')
    .isEmail().withMessage('Eto email')
    .custom(async email => {
            return await authService.checkIsConfirmed(email).then(function(user) {
                if (!user) {
                    throw new Error('this user is not exist')
                }
                if (user?.emailConfirmation.isConfirmed === true) {
                    throw new Error('this email is already confirm1')
                }            
            }
        )        
    }).withMessage('this email is already confirm1')

authRouter.post('/registration', usersLoginValidation, userEmailValidation, usersPasswordValidation, async(req: Request, res: Response) => {
    
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

    const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
    if (user) {
        res.status(204).send()
    } else {
        res.status(400).send()
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
    
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.status(204).send()
        } else {
            res.send(400)
        }
    
})

authRouter.post('/registration-email-resending', EmailValidation, async(req: Request, res: Response) => {

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
    
    const user = await authService.checkIsConfirmed(req.body.email)
    if (user && user?.emailConfirmation.isConfirmed === false) {
            await authService.resendConfirmEmail(user)
            res.status(204).send()
    } else {
        res.send(400)
    }
    
})