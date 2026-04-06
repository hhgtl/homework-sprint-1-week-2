import {usersRepositories} from "../infrastructure/users-repositories";
import {ObjectId} from "mongodb";
import {bcryptService} from "../../auth/adapters/hash-adapter";
import {Result} from "../../../common/types/result";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {randomUUID} from "crypto";
import {addHours} from "date-fns";


type CreateUserDto = {
    email: string;
    password: string;
    login: string;
}

export const usersService = {
    createUser: async ({login, email, password}: CreateUserDto): Promise<Result<ObjectId | null>> => {
        const errorMessages = []
        const isEmailUnique = await usersRepositories.findUserByEmail(email)
        const isLoginUnique = await usersRepositories.findUserByLogin(login)

        if (isEmailUnique) {
            errorMessages.push({field: 'email', message: 'email should be unique'})
        }

        if (isLoginUnique) {
            errorMessages.push({field: 'login', message: 'login should be unique'})
        }

        if (errorMessages.length > 0) {
            return {
                status: HttpStatuses.BadRequest,
                extensions: errorMessages,
                data: null
            }
        }

        const hashedPassword = await bcryptService.generateHash(password)

        const newUser = {
            email: email.toLowerCase(),
            password: hashedPassword,
            login,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                confirmationCodeExpirationDate: addHours(new Date(), 12),
                isConfirmed: true,
            }
        }

        const userId = await usersRepositories.createUser(newUser);

        return {
            status: HttpStatuses.Success,
            extensions: errorMessages,
            data: userId
        }
    },
    deleteUserById: async (_id: ObjectId): Promise<Result> => {
        const isUserDeleted = await usersRepositories.deleteUserById(_id);

        if (isUserDeleted) {
            return {
                status: HttpStatuses.NoContent,
                extensions: [],
                data: null
            }
        }

         return {
            status: HttpStatuses.NotFound,
            extensions: [],
            data: null
        }

    }
}