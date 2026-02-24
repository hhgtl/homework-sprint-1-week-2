import {Request, Response} from "express";
import {HttpStatuses
} from "../../../../common/types/http-statuses";
import {authService} from "../../domain/auth-service";

export const meHandler = async (req: Request, res: Response) => {
    const bearerJWT = req.headers.authorization;

    if (!bearerJWT) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    const jwt = bearerJWT.split(' ')[1]

    const meResult = await authService.me(jwt)

    if (meResult.status !== HttpStatuses.Success) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    res.status(HttpStatuses.Success).send(meResult.data)

}