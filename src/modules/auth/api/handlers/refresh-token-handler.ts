import {Request, Response} from "express";
import {authService} from "../../domain/auth-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {ResultStatus} from "../../../../common/types/result-status";
import {COOKIE_MAX_AGE_20_SECONDS, REFRESH_TOKEN} from "../../constants/token-constants";

export const refreshTokenHandler = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const { status, data } = await authService.refreshToken(refreshToken);

    if (status === ResultStatus.Unauthorized) {
        return res.status(HttpStatuses.Unauthorized).send()
    }


    if (status === ResultStatus.Success && data) {
        res.cookie(REFRESH_TOKEN, data.newRefreshToken, {httpOnly: true, secure: true, maxAge: COOKIE_MAX_AGE_20_SECONDS})
        return res.status(HttpStatuses.Success).send({accessToken: data.newAccessToken})
    }

    return res.status(HttpStatuses.ServerError).send()
}