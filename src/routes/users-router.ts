import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";

export const usersRouter = Router({})

usersRouter.get('/', async(req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const users = await usersService.getAllUsers(PageNumber, PageSize)
    res.send(users)
})

usersRouter.post('/login', async(req: Request, res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body.login, req.body.password)
})