import {authService} from "../../domain/auth-service";
import {HttpStatuses
} from "../../../../common/types/http-statuses";
import { Request, Response } from 'express';
import {COOKIE_MAX_AGE_20_SECONDS, REFRESH_TOKEN} from "../../constants/token-constants";

export const loginHandler = async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body;
    const userAgent = req.headers['user-agent'] || 'unknown agent';
    const ip = req.ip || 'unknown';
    // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown ip'


    const user = await authService.loginUser({loginOrEmail, password,
        userAgent, ip
    });

    if (user.status !== HttpStatuses.Success) {
        return res.status(user.status).send(user)
    }

    res.cookie(REFRESH_TOKEN, user.data?.refreshToken, {httpOnly: true, secure: true, maxAge: COOKIE_MAX_AGE_20_SECONDS, sameSite: 'none', path: '/'})
    res.status(HttpStatuses.Success).send({accessToken: user.data?.accessToken})
}