import {RateLimitDbType} from "../types/rate-limit-db-type";
import {rateLimitCollection} from "../../../db/db";

export const rateLimitRepositories = {
    async addToRateLimit(data: RateLimitDbType) {
        const res = await rateLimitCollection.insertOne(data);
        return res.insertedId;
    },
    async findByIpAndUrl({ip, url}: {url: string, ip: string}) {
        return await rateLimitCollection.find({ip, url}).toArray();
    }
}