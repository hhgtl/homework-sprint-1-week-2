import {testingRepositories} from "../../testing/infrastructure/testing-repositories";
import {client} from "../../../db/db";
import {usersService} from "../../users/domain/users-service";
import {ObjectId} from "mongodb";
import {authService} from "./auth-service";

// jest.setTimeout(100_000_000);

describe('integration tests for auth-service', () => {

    describe('login user', () => {
        let accessToken: string | null;
        let userId: ObjectId | null;
        let login: string = 'userForDelete';
        let email: string = 'delete@gmail.com';
        let password: string = 'password123';

        beforeAll(async () => {
            await testingRepositories.removeAllData()

            const userData = await usersService.createUser({
                login,
                email,
                password
            })

            userId = userData.data!
        })

        afterAll(async () => {
            await client.close();
        });

        it('should return true if email and password is correct', async () => {
            const {data} = await authService.loginUser({loginOrEmail: email, password: password})

            expect(data).not.toBeNull();
            expect(typeof data?.accessToken).toBe('string');

            const {data: userData} = await authService.me(data?.accessToken!)

            expect(userData).not.toBeNull()
            expect(userData?.email).toBe(email)
            expect(userData?.login).toBe(login)
            expect(userData?.userId).toBe(userId!.toString())
        });

        it('should return true if login and password is correct', async () => {
            const {data} = await authService.loginUser({loginOrEmail: login, password: password})

            expect(data).not.toBeNull();
            expect(typeof data?.accessToken).toBe('string');

            const {data: userData} = await authService.me(data?.accessToken!)

            expect(userData).not.toBeNull()
            expect(userData?.email).toBe(email)
            expect(userData?.login).toBe(login)
            expect(userData?.userId).toBe(userId!.toString())
        });

        it('should return true if email is incorrect', async () => {

        })
    })

})