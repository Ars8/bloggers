import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {body, validationResult} from "express-validator";
import { authService } from "../domain/auth-service";
import { antiDDoSMiddleware } from "../middlewares/antiDDoSMiddleware";

export const authRouter = Router({})

export const usersLoginValidation = body('login')
    .exists().withMessage('incorrect login')
    .trim().notEmpty().withMessage('incorrect login')
    .isString().withMessage('incorrect login')
    .isLength({ min: 3, max: 10 }).withMessage('incorrect login')

export const usersLoginExistValidation = body('login')
    .custom(async login => {
        return await authService.checkLogin(login).then(function(user) {
            if (user) {
                throw new Error('cannot find login change')
            }
        }
        )        
    }).withMessage('cannot find login change')

export const usersPasswordValidation = body('password')
    .exists().withMessage('incorrect password')
    .trim().notEmpty().withMessage('incorrect password')
    .isString().withMessage('incorrect password')
    .isLength({ min: 6, max: 20 }).withMessage('incorrect login')

export const codeValidation = body('code')
    .exists().withMessage('incorrect code')
    .trim().notEmpty().withMessage('incorrect code')
    .isString().withMessage('incorrect code')
    .custom(async code => {
        console.log(code)
        return await authService.checkCode(code).then(function(user) {
            if (!user) {
                throw new Error('can not find this code')
            }
        }
        )        
    }).withMessage('can not find this code')

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
    /* .custom(async email => {
            return await authService.checkIsConfirmed(email).then(function(user) {
                if (!user) {
                    throw new Error('this user is not exist')
                }         
            }
        )        
    }).withMessage('this user is not exist') */

const EmailValidationIsConfirmed = body('email')
    .exists().withMessage('incorrect email')
    .trim().notEmpty().withMessage('incorrect email')
    .isString().withMessage('incorrect email')
    .isEmail().withMessage('Eto email')
    .custom(async email => {
            return await authService.checkIsConfirmed(email).then(function(user) {
                console.log(user)
                if (user?.emailConfirmation.isConfirmed === true) {
                    throw new Error('this email is already confirm541')
                }            
            }
        )        
    }).withMessage('this email is already confirm541')

authRouter.post('/registration', antiDDoSMiddleware, usersLoginValidation, usersLoginExistValidation, userEmailValidation, usersPasswordValidation, async(req: Request, res: Response) => {
    
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

    const check = await authService.checkEmail(req.body.email)
    if (check) {
        res.status(400).send()        
    }

    const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
    if (!user) {
        res.status(400).send()        
    } else {
        res.status(204).send()
    }
})

authRouter.post('/registration-confirmation', antiDDoSMiddleware, codeValidation, async(req: Request, res: Response) => {

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
    
    const result = await authService.confirmEmail(req.body.code)
    if (!result) {
        res.send(400)
    } else {        
        res.status(204).send()
    }
    
})

authRouter.post('/registration-email-resending', antiDDoSMiddleware, EmailValidationIsConfirmed, async(req: Request, res: Response) => {

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
    if (!user) {
        res.send(400)
    } else {        
        await authService.resendConfirmEmail(user)
        res.status(204).send()
    }
    
})

authRouter.post('/login', antiDDoSMiddleware, usersLoginValidation, usersPasswordValidation, async(req: Request, res: Response) => {

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
    if (!user || user === undefined) {
        return res.sendStatus(401)
    } else {        
        const token = await jwtService.createJWT(user)
        return res.status(200).send({token})
    }
})
