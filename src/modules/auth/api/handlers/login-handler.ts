import {authService} from "../../domain/auth-service";
import {HttpStatuses
} from "../../../../common/types/http-statuses";
import { Request, Response } from 'express';

export const loginHandler = async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body;

    const user = await authService.loginUser({loginOrEmail, password});

    if (user.status !== HttpStatuses.Success) {
        return res.status(user.status).send(user)
    }


    res.status(HttpStatuses.Success).send({accessToken: user.data?.accessToken})


}