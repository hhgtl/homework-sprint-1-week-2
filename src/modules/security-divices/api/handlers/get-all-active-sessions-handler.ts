import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {securityDivicesService} from "../../domain/security-divices-service";
import {ResultStatus} from "../../../../common/types/result-status";

export const getAllActiveSessionsHandler = async (req: Request, res: Response) => {
    const bearerJWT = req.headers.authorization;
    console.log("bearerJWT:", bearerJWT);
    console.log("ALL HEADERS:", JSON.stringify(req.headers))
    if (!bearerJWT) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    const accessToken = bearerJWT.split(' ')[1]

    const allActiveSessions = await securityDivicesService.getAllActiveSessions({accessToken})

    if (allActiveSessions.status === ResultStatus.Success) {
        return res.status(HttpStatuses.Success).send(allActiveSessions.data)
    } else if (allActiveSessions.status === ResultStatus.Unauthorized) {
        return res.status(HttpStatuses.Unauthorized).send()
    } else if (allActiveSessions.status === ResultStatus.NotFound) {
        return res.status(HttpStatuses.NotFound).send()
    }

    return res.status(HttpStatuses.ServerError).send()
}