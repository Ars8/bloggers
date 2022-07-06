import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";

export const usersRouter = Router({})

usersRouter.get('/', async(req: Request, res: Response) => {
    let PageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    let PageSize = req.query.PageSize ? +req.query.PageSize : 10
    const users = await usersService.getAllUsers(PageNumber, PageSize)
    res.status(200).send(users)
})
usersRouter.post('/', async(req: Request, res: Response) => {
    const user = await usersService.createUser(req.body.login, req.body.password)
})