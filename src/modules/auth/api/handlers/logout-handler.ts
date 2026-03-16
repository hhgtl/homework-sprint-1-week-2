import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {jwtAdapter} from "../../adapters/jwt-adapter";
import {REFRESH_TOKEN} from "../../constants/token-constants";
import {authService} from "../../domain/auth-service";
import {ResultStatus} from "../../../../common/types/result-status";

export const logoutHandler = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const {status} = await authService.logout(refreshToken)

    if (status === ResultStatus.Unauthorized) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    if (status === ResultStatus.Success) {
        res.clearCookie(REFRESH_TOKEN, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        })

        return res.status(HttpStatuses.NoContent).send()
    }

    return res.status(HttpStatuses.ServerError).send()
}