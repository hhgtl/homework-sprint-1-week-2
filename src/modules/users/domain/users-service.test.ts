// import {testingRepositories} from "../../testing/infrastructure/testing-repositories";
// import {client} from "../../../db/db";
// import {usersService} from "./users-service";
// import {ObjectId} from "mongodb";
// import {Result} from "../../../common/types/result";
// import mongoose from "mongoose";
// import {usersRepositoriesQuery} from "../infrastructure/users-repositories-query";
// import {HttpStatuses} from "../../../common/types/http-statuses";
//
//
// describe('integration tests for users-service', () => {
//     afterAll(async () => {
//         await client.close();
//     });
//
//     describe('create user', () => {
//         let createdUserId: Result<ObjectId | null>;
//
//         const newLogin = 'user'
//         const newEmail = 'user@gmail.com'
//         const newPassword = 'qwerty123'
//
//         beforeAll(async () => {
//             await testingRepositories.removeAllData()
//         })
//
//         it('should return true for create new user', async () => {
//             createdUserId = await usersService.createUser({login: newLogin, email: newEmail, password: newPassword})
//
//
//             expect(createdUserId.data).not.toBeNull()
//             expect(mongoose.Types.ObjectId.isValid(createdUserId.data!)).toBe(true);
//         });
//
//         it('should return true for find user by id', async () => {
//             expect(createdUserId.data).not.toBeNull()
//
//             const findUser = await usersRepositoriesQuery.findUserById(createdUserId.data!)
//
//             expect(findUser).toEqual({
//                 id: createdUserId.data?.toString(),
//                 login: newLogin,
//                 email: newEmail,
//                 createdAt: expect.any(String)
//             });
//         });
//
//         it('should return status code 400 if login not unique', async () => {
//             const payload = await usersService.createUser({login: newLogin, email: 'notBusyEmail@gmail.com', password: newPassword})
//
//             expect(payload.status).toBe(HttpStatuses.BadRequest)
//             expect(payload.data).toBeNull()
//         });
//
//         it('should return status code 400 if email not unique', async () => {
//             const payload = await usersService.createUser({login: 'notBusyLogin', email: newEmail, password: newPassword})
//
//             expect(payload.status).toBe(HttpStatuses.BadRequest)
//             expect(payload.data).toBeNull()
//         });
//     })
//
//     describe('delete user', () => {
//         let userToDeleteId: ObjectId;
//
//         beforeAll(async () => {
//             await testingRepositories.removeAllData()
//
//             const payload = await usersService.createUser({
//                 login: 'userForDelete',
//                 email: 'delete@gmail.com',
//                 password: 'password123'
//             })
//             userToDeleteId = payload.data!
//         })
//
//         it('should return status code 204 if user be deleted', async () => {
//             const payload = await usersService.deleteUserById(userToDeleteId)
//
//             expect(payload.status).toBe(HttpStatuses.NoContent)
//
//         });
//
//         it('should return status code 404 if userId be not found', async () => {
//             const payload = await usersService.deleteUserById(userToDeleteId)
//
//             expect(payload.status).toBe(HttpStatuses.NotFound)
//         });
//     })
// })