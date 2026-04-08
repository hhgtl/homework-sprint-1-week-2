import { Request, Response, NextFunction } from 'express'
import {rateLimitService} from "../domain/rate-limit-service";
import {HttpStatuses} from "../../../common/types/http-statuses";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const url = (req.baseUrl + req.path).replace(/\/$/, '') || '/'

    const isThrottled = await rateLimitService.checkRateLimit({url, ip})

    if (isThrottled) {
        return res.status(HttpStatuses.TooManyRequests).send()
    }

    await rateLimitService.addToRateLimit({url, ip})

    next()
}