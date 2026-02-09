import {usersRepositories} from "../../users/infrastructure/users-repositories";
import {bcryptService} from "../adapters/hash-adapter";


export const authService = {
    async checkUserCredentials({loginOrEmail, password}: {loginOrEmail: string, password: string}) {
        const user = await usersRepositories.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            return false
        }

        return bcryptService.checkPassword(password, user.password)
    }

}