import {authCollection} from "../../../db/db";
import {AuthDbType} from "../types/auth-db-type";
import {ObjectId, WithId} from "mongodb";

export class AuthRepositories {
    async createNewSession(newSession: AuthDbType) {
        const session = await authCollection.insertOne(newSession);
        return session.insertedId;
    }
    async findSessionByDeviceId(deviceId: string): Promise<WithId<AuthDbType> | null> {
        return await authCollection.findOne({deviceId});
    }
    async updateSessionById(_id: ObjectId, payload: AuthDbType) {
        const res = await authCollection.updateOne({_id}, {$set: payload})
        return res.matchedCount === 1
    }
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        const res = await authCollection.deleteOne({deviceId})
        return res.deletedCount === 1
    }
    async deleteAllSessionByUserIdExcludeCurrentSession({userId, deviceId}: {userId: ObjectId, deviceId: string}): Promise<boolean> {
        const res = await authCollection.deleteMany({
            userId,
            deviceId: {$ne: deviceId}
        })
        return res.deletedCount === 1
    }
}
