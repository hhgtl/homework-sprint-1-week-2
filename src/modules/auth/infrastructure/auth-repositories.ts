import {authCollection, blogsCollection} from "../../../db/db";
import {AuthDbType} from "../types/auth-db-type";
import {ObjectId, WithId} from "mongodb";

export const authRepositories = {
    async createNewSession(newSession: AuthDbType) {
        const session = await authCollection.insertOne(newSession);
        return session.insertedId;
    },
    async findSessionByDeviceId(deviceId: string): Promise<WithId<AuthDbType> | null> {
        return await authCollection.findOne({deviceId});
    },
    async updateSessionById(_id: ObjectId, payload: AuthDbType) {
        const res = await authCollection.updateOne({_id}, {$set: payload})
        return res.matchedCount === 1
    },
}