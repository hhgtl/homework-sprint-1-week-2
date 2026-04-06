// import {testingRepositories} from "../../testing/infrastructure/testing-repositories";
// import {client} from "../../../db/db";
// import {usersService} from "../../users/domain/users-service";
// import {ObjectId} from "mongodb";
// import {authService} from "./auth-service";
// import {HttpStatuses} from "../../../common/types/http-statuses";
// import {ResultStatus} from "../../../common/types/result-status";
// import {securityDivicesService} from "../../security-divices/domain/security-divices-service";
// import {Result} from "../../../common/types/result";
//
// // jest.setTimeout(100_000_000);
//
// describe('integration tests for auth-service', () => {
//
//     describe('login user', () => {
//         let userId: ObjectId | null;
//         let login: string = 'userForDelete';
//         let email: string = 'delete@gmail.com';
//         let password: string = 'password123';
//
//         let user1: Result<{accessToken: string, refreshToken: string} | null>
//         let user2: Result<{accessToken: string, refreshToken: string} | null>
//         let user3: Result<{accessToken: string, refreshToken: string} | null>
//         let user4: Result<{accessToken: string, refreshToken: string} | null>
//
//         beforeAll(async () => {
//             await client.connect();
//             await testingRepositories.removeAllData()
//
//             const userData = await usersService.createUser({
//                 login,
//                 email,
//                 password
//             })
//
//             userId = userData.data!
//         })
//
//         afterAll(async () => {
//             await client.close();
//         });
//
//         it('test1', async () => {
//             user1 = await authService.loginUser({ip: '1', userAgent: 'agent1', loginOrEmail: email, password: password})
//             user2 = await authService.loginUser({ip: '2', userAgent: 'agent2', loginOrEmail: email, password: password})
//             user3 = await authService.loginUser({ip: '3', userAgent: 'agent3', loginOrEmail: email, password: password})
//             user4 = await authService.loginUser({ip: '4', userAgent: 'agent4', loginOrEmail: email, password: password})
//
//             const allSessions = await securityDivicesService.getAllActiveSessions({accessToken: user4.data?.accessToken as string})
//
//             expect(allSessions.data).not.toBeNull()
//
//             expect(allSessions.data?.length).toBe(4)
//         });
//
//         it('test2', async () => {
//             await securityDivicesService.deleteAllSessions({accessToken: user4.data?.accessToken as string})
//
//             const allSessions = await securityDivicesService.getAllActiveSessions({accessToken: user4.data?.accessToken as string})
//
//             expect(allSessions.data).not.toBeNull()
//
//             expect(allSessions.data?.length).toBe(1)
//         });
//
//     //     it('should return true if login and password is correct', async () => {
//     //         const {data} = await authService.loginUser({loginOrEmail: login, password: password})
//     //
//     //         expect(data).not.toBeNull();
//     //         expect(typeof data?.accessToken).toBe('string');
//     //
//     //         const {data: userData} = await authService.me(data?.accessToken!)
//     //
//     //         expect(userData).not.toBeNull()
//     //         expect(userData?.email).toBe(email)
//     //         expect(userData?.login).toBe(login)
//     //         expect(userData?.userId).toBe(userId!.toString())
//     //     });
//     //
//     //     it('should return true if email or login is incorrect', async () => {
//     //         const {data, errorMessage, status} = await authService.loginUser({loginOrEmail: 'incorrect loginOrEmail', password: password})
//     //
//     //         expect(data).toBeNull();
//     //         expect(errorMessage).toBe('Unauthorized');
//     //         expect(status).toBe(HttpStatuses.Unauthorized);
//     //     })
//     })
//
//     // describe('register user', () => {
//     //     const correctLogin: string = 'hh66gtl';
//     //     const correctEmail: string = 'petrosahal66@gmail.com';
//     //     const correctPassword: string = 'qwerty';
//     //
//     //     beforeAll(async () => {
//     //         await client.connect();
//     //         await testingRepositories.removeAllData()
//     //     })
//     //
//     //     afterAll(async () => {
//     //         await client.close();
//     //     });
//     //
//     //     it('should return true if user success registered', async () => {
//     //         const {status} = await authService.registration({
//     //             password: correctPassword,
//     //             login: correctLogin,
//     //             email: correctEmail
//     //         })
//     //
//     //         expect(status).toBe(ResultStatus.Success)
//     //     })
//     //
//     //     it('should return false if user with email is already registered', async () => {
//     //         const {status} = await authService.registration({
//     //             password: correctPassword,
//     //             login: 'newLogin',
//     //             email: correctEmail
//     //         })
//     //
//     //         expect(status).toBe(ResultStatus.BadRequest)
//     //     })
//     //
//     //     it('should return false if user with login is already registered', async () => {
//     //         const {status} = await authService.registration({
//     //             password: correctPassword,
//     //             login: correctLogin,
//     //             email: "newEmail"
//     //         })
//     //
//     //         expect(status).toBe(ResultStatus.BadRequest)
//     //     })
//     //
//     //
//     // })
//
// })