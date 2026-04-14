import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {ResultStatus} from "../../../../common/types/result-status";
import {AuthService} from "../../domain/auth-service";

const authService = new AuthService()

export const registrationHandler = async (req: Request, res: Response) => {
    const { login, password, email } = req.body;

    console.log("login", login);
    console.log("password", password);
    console.log("email", email);

    const payload = await authService.registration({login, email, password});

    if (payload.status === ResultStatus.BadRequest) {
        return res.status(HttpStatuses.BadRequest).send({
            "errorsMessages": payload.extensions
        })
    }

    if (payload.status === ResultStatus.Success) {
        return res.status(HttpStatuses.NoContent).send()
    }

    res.status(HttpStatuses.ServerError).send()


}