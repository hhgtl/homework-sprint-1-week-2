import {usersRepositories} from "../../users/infrastructure/users-repositories";
import {bcryptService} from "../adapters/hash-adapter";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {jwtAdapter} from "../adapters/jwt-adapter";
import {usersRepositoriesQuery} from "../../users/infrastructure/users-repositories-query";
import {ObjectId} from "mongodb";


export const authService = {
    async loginUser({loginOrEmail, password}: {loginOrEmail: string, password: string}) {

        const result =  await this.checkUserCredentials({loginOrEmail, password});

        if (result.status !== HttpStatuses.Success) {
            return {
                status: HttpStatuses.Unauthorized,
                errorMessage: 'Unauthorized',
                extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
                data: null,
            };
        }

        const accessToken = jwtAdapter.createToken({userId: result.data?._id.toString()!})

        return {
            status: HttpStatuses.Success,
            data: { accessToken },
            extensions: [],
        };
    },
    async me(jwtToken: string) {
        try {
            const payload = jwtAdapter.verifyToken(jwtToken)

            if (!payload) {
                return {
                    status: HttpStatuses.Unauthorized,
                    data: null,
                    extensions: [],
                };
            }

            const {userId} = payload.data

            const user = await usersRepositoriesQuery.findUserById(new ObjectId(userId))

            if (!user) {
                return {
                    status: HttpStatuses.NotFound,
                    data: null,
                    extensions: [],
                };
            }

             return {
                status: HttpStatuses.Success,
                data: {
                    login: user.login,
                    email: user.email,
                    userId: user.id.toString(),

                },
                extensions: [],
            };

        } catch (error) {
            return {
                status: HttpStatuses.Unauthorized,
                data: null,
                extensions: [],
            };
        }



    },
    async checkUserCredentials({loginOrEmail, password}: {loginOrEmail: string, password: string}) {
        const user = await usersRepositories.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            return {
                status: HttpStatuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
            };
        }

        const isPassCorrect = await bcryptService.checkPassword(password, user.password)

        if (!isPassCorrect)
            return {
                status: HttpStatuses.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{ field: 'password', message: 'Wrong password' }],
            };

        return {
            status: HttpStatuses.Success,
            data: user,
            extensions: [],
        };
    }

}