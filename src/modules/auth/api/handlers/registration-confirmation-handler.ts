import {Request, Response} from "express";
import {ResultStatus} from "../../../../common/types/result-status";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {AuthService} from "../../domain/auth-service";

const authService = new AuthService()


export const registrationConfirmationHandler = async (req: Request, res: Response) => {
    const { code } = req.body;

    const payload = await authService.registrationConfirmation({code});

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