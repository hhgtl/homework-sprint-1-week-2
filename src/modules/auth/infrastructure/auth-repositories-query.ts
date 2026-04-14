import {ObjectId, WithId} from "mongodb";
import {AuthViewType} from "../types/auth-view-type";
import {AuthDbType} from "../types/auth-db-type";
import {authCollection} from "../../../db/db";

export class AuthRepositoriesQuery {
    async findAllSessionsByUserId(userId: ObjectId): Promise<AuthViewType[] | null> {
        const sessions = await authCollection.find({userId}).toArray()

        if (!sessions) return null;

        return sessions.map(session => this._getInView(session));
    }
    private _getInView(sessions: WithId<AuthDbType>): AuthViewType {
        return {
            deviceId: sessions.deviceId,
            title: sessions.title,
            ip: sessions.ip,
            lastActiveDate: sessions.lastActiveDate,
        };
    }
}
