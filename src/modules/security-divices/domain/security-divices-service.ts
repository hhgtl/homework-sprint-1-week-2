import {jwtAdapter} from "../../auth/adapters/jwt-adapter";
import {ResultStatus} from "../../../common/types/result-status";
import {authRepositoriesQuery} from "../../auth/infrastructure/auth-repositories-query";
import {ObjectId} from "mongodb";
import {authRepositories} from "../../auth/infrastructure/auth-repositories";

export const securityDivicesService = {
    async getAllActiveSessions({accessToken}: {accessToken: string}) {
        const jwtPayload = jwtAdapter.verifyToken(accessToken)

        if (!jwtPayload) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: [],
            };
        }

        const {userId} = jwtPayload

        const allSessions = await authRepositoriesQuery.findAllSessionsByUserId(new ObjectId(userId!))

        if (!allSessions) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: [],
            };
        }

        return {
            status: ResultStatus.Success,
            data: allSessions,
            extensions: [],
        };
    },
    async deleteSessionByDeviceId({deviceId, accessToken}: {deviceId: string, accessToken: string}) {
        const accessTokenPayload = jwtAdapter.verifyToken(accessToken)

        if (!accessTokenPayload) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: [],
            };
        }

        const { userId } = accessTokenPayload

        const session = await authRepositories.findSessionByDeviceId(deviceId)

        if (!session) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                extensions: [],
            };
        }

        if (session.userId.toString() !== userId) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: [],
            };
        }

        const isDeleted = await authRepositories.deleteSessionByDeviceId(deviceId!)

        if (isDeleted) {
            return {
                status: ResultStatus.Success,
                data: null,
                extensions: [],
            };
        }

        return {
            status: ResultStatus.NotFound,
            data: null,
            extensions: [],
        };
    },
    async deleteAllSessions({accessToken}: {accessToken: string}) {
        const accessTokenPayload = jwtAdapter.verifyToken(accessToken)

        if (!accessTokenPayload) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: [],
            };
        }

        const { userId, deviceId } = accessTokenPayload

        await authRepositories.deleteAllSessionByUserIdExcludeCurrentSession({userId: new ObjectId(userId), deviceId})

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    }
}
