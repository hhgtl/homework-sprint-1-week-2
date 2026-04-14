import {RateLimitDbType} from "../types/rate-limit-db-type";
import {rateLimitCollection} from "../../../db/db";

export class RateLimitRepositories {
    async addToRateLimit(data: RateLimitDbType) {
        const res = await rateLimitCollection.insertOne(data);
        return res.insertedId;
    }
    async findByIpAndUrlSince({ip, url, since}: {url: string, ip: string, since: string}) {
        return await rateLimitCollection.countDocuments({
            ip,
            url,
            date: { $gt: since }
        });
    }
}
