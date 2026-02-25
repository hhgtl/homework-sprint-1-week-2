import {usersRepositories} from "../../users/infrastructure/users-repositories";
import {bcryptService} from "../adapters/hash-adapter";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {jwtAdapter} from "../adapters/jwt-adapter";
import {usersRepositoriesQuery} from "../../users/infrastructure/users-repositories-query";
import {ObjectId} from "mongodb";
import {Result} from "../../../common/types/result";
import {ResultStatus} from "../../../common/types/result-status";
import {UsersDbType} from "../../users/types/users-db-type";
import {randomUUID} from "crypto";
import {addHours} from "date-fns";
import {nodemailerAdapter} from "../adapters/nodemailer-adapter";
import {UsersViewType} from "../../users/types/users-view-type";


export const authService = {
    async loginUser({loginOrEmail, password}: {loginOrEmail: string, password: string}): Promise<Result<{accessToken: string} | null>> {

        const result =  await this._checkUserCredentials({loginOrEmail, password});

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
    async me(jwtToken: string): Promise<Result<{login: string, email: string, userId: string} | null>> {
        try {
            const payload = jwtAdapter.verifyToken(jwtToken)

            if (!payload) {
                return {
                    status: HttpStatuses.Unauthorized,
                    data: null,
                    extensions: [],
                };
            }

            const {userId} = payload

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
    async registration({login, email, password}: {login: string, password: string, email: string}): Promise<Result<UsersViewType | null>> {
        const errorMessages = []
        const isLoginUnique = await usersRepositories.findUserByLogin(login)
        const isEmailUnique = await usersRepositories.findUserByEmail(email)

        if (isEmailUnique) {
            errorMessages.push({field: 'email', message: 'email should be unique'})
        }

        if (isLoginUnique) {
            errorMessages.push({field: 'login', message: 'login should be unique'})
        }

        if (errorMessages.length > 0) {
            return {
                status: ResultStatus.BadRequest,
                extensions: errorMessages,
                data: null
            }
        }

        const hashedPassword = await bcryptService.generateHash(password)

        const confirmationCode = randomUUID()

        const newUser = {
            email: email.toLowerCase(),
            password: hashedPassword,
            login,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode,
                confirmationCodeExpirationDate: addHours(new Date(), 12),
                isConfirmed: false,
            }
        }

        const userId = await usersRepositories.createUser(newUser);

        const findCreatedUser = await usersRepositoriesQuery.findUserById(userId);

        await nodemailerAdapter.sendEmail({email, confirmationCode}).catch(console.error);

        return {
            status: ResultStatus.Success,
            data: findCreatedUser,
            extensions: [],
        };
    },
    async registrationConfirmation({ code }: {code: string}): Promise<Result> {
        const fundedUserByConfirmationCode = await usersRepositories.findUserByConfirmationCode(code);

        if (!fundedUserByConfirmationCode) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{field: 'code', message: 'not founded user'}],
            };
        }

        if (fundedUserByConfirmationCode.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{field: 'code is confirmed', message: 'bla bla'}],
            };
        }

        if (fundedUserByConfirmationCode.emailConfirmation.confirmationCodeExpirationDate < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{field: 'expired code time', message: 'bla bla'}],
            };
        }

        await usersRepositories.confirmUserById(fundedUserByConfirmationCode._id)

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    },
    async registrationEmailResending({ email }: {email: string}): Promise<Result> {
        const user = await usersRepositories.findUserByEmail(email)

        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'user not found', message: ''}],
                data: null
            }
        }

        if (user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code is confirmed', message: 'bla'}],
                data: null
            }
        }

        const confirmationCode = randomUUID()

        const isUpdatedConfirmationCode = await usersRepositories.updateConfirmationCode({_id: user._id,
            newCode: confirmationCode,
            newExpirationDate: addHours(new Date, 12)})

        if (!isUpdatedConfirmationCode) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'expired code time', message: 'bla bla'}],
                data: null
            }
        }

        await nodemailerAdapter.sendEmail({email, confirmationCode}).catch(console.error);

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    },
    async _checkUserCredentials({loginOrEmail, password}: {loginOrEmail: string, password: string}) {
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