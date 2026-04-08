import {RateLimitDbType} from "../types/rate-limit-db-type";
import {rateLimitRepositories} from "../infrastructure/rate-limit-repositories";

export const rateLimitService = {
    async checkRateLimit({ip, url}: {url: string, ip: string}) {
        const timeLimit = new Date(Date.now() - 10000).toISOString();
        const recentRequestsCount = await rateLimitRepositories.findByIpAndUrlSince({ip, url, since: timeLimit});

        return recentRequestsCount >= 5;
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