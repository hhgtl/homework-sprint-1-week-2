import { Request, Response, NextFunction } from 'express'
import {HttpStatuses} from "../types/http-statuses";
import {jwtAdapter} from "../../modules/auth/adapters/jwt-adapter";

export interface AuthRequest extends Request {
    userId?: string
}

export const authJwtMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(HttpStatuses.Unauthorized).send()
        return
    }

    const jwtToken = authHeader.split(' ')[1]

    const payload = jwtAdapter.verifyToken(jwtToken)

    if (!payload) {
        res.status(HttpStatuses.Unauthorized).send()
        return
    }

    req.userId = payload.userId

    next()
}