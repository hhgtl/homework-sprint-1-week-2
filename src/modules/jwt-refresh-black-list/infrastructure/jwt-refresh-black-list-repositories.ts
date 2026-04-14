import {jwtRefreshBlackListCollection} from "../../../db/db";

export class JwtRefreshBlackListRepositories {
    async addJwtToBlackList(jwt: string) {
        const res = await jwtRefreshBlackListCollection.insertOne({jwt})
        return res.insertedId
    }
    async findJwtInBlackList(jwt: string) {
        return await jwtRefreshBlackListCollection.findOne({jwt})
    }
}
