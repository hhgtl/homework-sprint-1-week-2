import {UsersService} from "../../domain/users-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {UsersRepositoriesQuery} from "../../infrastructure/users-repositories-query";
import {Request, Response} from "express";

const usersService = new UsersService()
const usersRepositoriesQuery = new UsersRepositoriesQuery()

export const createNewUserHandler = async (req: Request, res: Response) => {
    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;

    const payload = await usersService.createUser({login, email, password})

    if (payload.status !== HttpStatuses.Success) {
        return res.status(payload.status).send(payload.extensions)
    }

    if (payload.status === HttpStatuses.Success && payload.data !== null) {
        const user = await usersRepositoriesQuery.findUserById(payload.data)

        res.status(HttpStatuses.Created).send(user)
    }

    return res.status(HttpStatuses.ServerError)
}