import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {jwtAdapter} from "../../adapters/jwt-adapter";
import {REFRESH_TOKEN} from "../../constants/token-constants";

export const logoutHandler = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const payload = jwtAdapter.verifyToken(refreshToken)

    if (!payload) {
        return res.status(HttpStatuses.Unauthorized).send()
    }

    if (payload) {
        res.clearCookie(REFRESH_TOKEN, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        })

        return res.status(HttpStatuses.NoContent).send()
    }

    return res.status(HttpStatuses.ServerError).send()
}