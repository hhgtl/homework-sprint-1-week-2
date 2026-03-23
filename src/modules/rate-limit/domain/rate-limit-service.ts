import {RateLimitDbType} from "../types/rate-limit-db-type";
import {rateLimitRepositories} from "../infrastructure/rate-limit-repositories";

export const rateLimitService = {
    async checkRateLimit({ip, url}: {url: string, ip: string}) {
        const payload = await rateLimitRepositories.findByIpAndUrl({ip, url});

        const checkDate = payload.every(({date}) => {
            return new Date(date).getTime() <= (Date.now() - 10000)
        });

        return payload.length < 5 && checkDate;
    },
    async addToRateLimit({ip, url}: {url: string, ip: string}) {
        const data: RateLimitDbType = {
            url,
            ip,
            date: new Date().toISOString(),
        }

        return await rateLimitRepositories.addToRateLimit(data)
    }
}