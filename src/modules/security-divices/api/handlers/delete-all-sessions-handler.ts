import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {securityDivicesService} from "../../domain/security-divices-service";
import {ResultStatus} from "../../../../common/types/result-status";

export const deleteAllSessionsHandler = async (req: Request, res: Response) => {
    const bearerJWT = req.headers.authorization;
    const accessToken = bearerJWT?.split(' ')[1]

    if (!accessToken) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    const result = await securityDivicesService.deleteAllSessions({accessToken})

    if (result.status === ResultStatus.Success) {
        return res.status(HttpStatuses.NoContent).send()
    }


    return res.status(HttpStatuses.ServerError).send()
}