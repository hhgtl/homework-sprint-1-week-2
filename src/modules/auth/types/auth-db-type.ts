import {ObjectId} from "mongodb";

export type AuthDbType = {
    userId: ObjectId
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
    iat: number
    exp: number
}