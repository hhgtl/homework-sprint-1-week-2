import {ObjectId} from "mongodb";

export type AuthDbType = {
    _id: ObjectId
    userId: ObjectId
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
    iat: string
    exp: string
}