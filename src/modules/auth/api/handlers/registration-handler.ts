import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {authService} from "../../domain/auth-service";
import {ResultStatus} from "../../../../common/types/result-status";

export const registrationHandler = async (req: Request, res: Response) => {
    const { login, password, email } = req.body;

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