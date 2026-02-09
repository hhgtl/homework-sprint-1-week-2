import {usersRepositories} from "../infrastructure/users-repositories";
import {ObjectId} from "mongodb";
import {bcryptService} from "../../auth/adapters/hash-adapter";

type CreateUserDto = {
    email: string;
    password: string;
    login: string;
}

export const usersService = {
    createUser: async ({login, email, password}: CreateUserDto) => {
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
            return errorMessages;
        }

        const hashedPassword = await bcryptService.generateHash(password)

        const newUser = {
            email: email.toLowerCase(),
            password: hashedPassword,
            login,
            createdAt: new Date(),
        }

        return await usersRepositories.createUser(newUser);
    },
    deleteUserById: async (_id: ObjectId) => {
        return await usersRepositories.deleteUserById(_id);
    }
}