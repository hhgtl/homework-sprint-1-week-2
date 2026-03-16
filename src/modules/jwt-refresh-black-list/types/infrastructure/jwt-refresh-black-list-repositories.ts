import {jwtRefreshBlackListCollection} from "../../../../db/db";

export const jwtRefreshBlackListRepositories = {
    async addJwtToBlackList(jwt: string) {
        const res = await jwtRefreshBlackListCollection.insertOne({jwt})
        return res.insertedId
    },
    async findJwtInBlackList(jwt: string) {
        return await jwtRefreshBlackListCollection.findOne({jwt})
    },
    // async deleteAllJwtInBlackList(_id: ObjectId) {
    //     const res = await jwtRefreshBlackListCollection.deleteOne({_id});
    //     return res.deletedCount === 1
    // }

}