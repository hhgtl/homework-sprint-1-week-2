import {Request, Response} from "express";
import {ResultStatus} from "../../../../common/types/result-status";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {AuthService} from "../../domain/auth-service";

const authService = new AuthService()


export const registrationEmailResendingHandler = async (req: Request, res: Response) => {
    const { email } = req.body;

    const payload = await authService.registrationEmailResending({email});

    if (payload.status === ResultStatus.BadRequest) {
        return res.status(HttpStatuses.BadRequest).send({
            errorsMessages: payload.extensions
        })
    }

    if (payload.status === ResultStatus.Success) {
        return res.status(HttpStatuses.NoContent).send()
    }

    return res.status(HttpStatuses.ServerError).send()



}