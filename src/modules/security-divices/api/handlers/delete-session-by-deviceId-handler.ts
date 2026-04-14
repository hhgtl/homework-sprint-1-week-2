import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {ResultStatus} from "../../../../common/types/result-status";
import {SecurityDivicesService} from "../../domain/security-divices-service";

const securityDivicesService = new SecurityDivicesService()

export const deleteSessionByDeviceIdHandler = async (req: Request<{ deviceId: string }>, res: Response) => {
    const deviceId = req.params.deviceId;
    const bearerJWT = req.headers.authorization;
    const accessToken = bearerJWT?.split(' ')[1]

    if (!accessToken) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    if (!deviceId) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    const result = await securityDivicesService.deleteSessionByDeviceId({deviceId, accessToken})

    if (result.status === ResultStatus.Success) {
        return res.status(HttpStatuses.NoContent).send()
    } else if (result.status === ResultStatus.NotFound) {
        return res.status(HttpStatuses.NotFound).send()
    } else if (result.status === ResultStatus.Unauthorized) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    return res.status(HttpStatuses.ServerError).send()
}