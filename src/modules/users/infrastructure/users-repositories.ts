import {usersCollection} from "../../../db/db";
import {UsersDbType} from "../types/users-db-type";
import {ObjectId} from "mongodb";

export const usersRepositories = {
    async createUser(newUser: UsersDbType) {
        const res = await usersCollection.insertOne(newUser);
        return res.insertedId;
    },
    async deleteUserById(_id: ObjectId) {
        const res = await usersCollection.deleteOne({_id});
        return res.deletedCount === 1;
    },
    async findUserByEmail(email: string) {
        return await usersCollection.findOne({email: email.toLowerCase()});
    },
    async findUserByLogin(login: string) {
        return await usersCollection.findOne({login});
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        const regex = new RegExp(`^${loginOrEmail}$`, 'i');
        return await usersCollection.findOne({
            $or: [
                { email: regex },
                { login: loginOrEmail }
            ]
        });
    }
}
