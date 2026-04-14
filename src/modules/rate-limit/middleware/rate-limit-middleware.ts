import { Request, Response, NextFunction } from 'express'
import {HttpStatuses} from "../../../common/types/http-statuses";
import {RateLimitService} from "../domain/rate-limit-service";

const rateLimitService = new RateLimitService()

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