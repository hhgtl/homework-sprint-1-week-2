import {testingRepositories} from "../../testing/infrastructure/testing-repositories";
import {blogsService} from "./blogs-service";
import mongoose from 'mongoose';
import {blogsRepositoriesQuery} from "../infrastructure/blogs-repositories-query";
import {ObjectId} from "mongodb";
import {client} from "../../../db/db";

describe('integration tests for blogs-service', () => {

    describe('create blogs', () => {
        let createdBlogId: ObjectId;

        const newBlogData = {
            name: 'newBlog',
            websiteUrl: 'https://SrZuY.BrwYI6xMUdkacXfqExn1WcWDJiINTCutN5Rtu23txI5kOd_Fsyc6PF7Xv-5XHL-uCV_jfdIe_ywzr4.zmnYH8q',
            description: 'new blog description'
        };

        beforeAll(async () => {
            await testingRepositories.removeAllData()
        })

        afterAll(async () => {
            await client.close();
        });

        it('should create a blog', async () => {
            createdBlogId = await blogsService.createBlog(newBlogData);

            expect(mongoose.Types.ObjectId.isValid(createdBlogId)).toBe(true);
        });

        it('should find the created blog by id', async () => {
            const blog = await blogsRepositoriesQuery.findBlogById(createdBlogId);

            expect(blog).toEqual({
                id: createdBlogId.toString(),
                name: newBlogData.name,
                description: newBlogData.description,
                websiteUrl: newBlogData.websiteUrl,
                isMembership: expect.any(Boolean),
                createdAt: expect.any(String)
            });
        });

        it('should return true after deleting blog by id', async () => {
            const res = await blogsService.removeBlogById(createdBlogId);

            expect(res).toEqual(true);
        })
    })

})

// jest.setTimeout(100_000_000); EXAMPLES
//
// describe('integration tests for AuthService', () => {
//     let mongoServer: MongoMemoryServer;
//
//     beforeAll(async () => {
//         mongoServer = await MongoMemoryServer.create()
//         const mongoUri = mongoServer.getUri()
//         await mongoose.connect(mongoUri)
//     })
//     afterAll(async () => {
//         await mongoose.disconnect()
//         await mongoServer.stop()
//     })
//
//     const usersRepository = new UsersRepository()
//     const usersService = new UsersService(usersRepository)
//
//     const emailTemplatesManager = new EmailTemplatesManager()
//
//     const emailAdapterMock: jest.Mocked<EmailAdapter> = {
//         sendEmail: jest.fn(),
//     }
//
//     const authService = new AuthService(emailTemplatesManager, emailAdapterMock, usersRepository, usersService)
//
//     describe("createUser", () => {
//         beforeAll(async () => {
//             await mongoose.connection.dropDatabase()
//         })
//
//
//         it('this.emailAdapter.sendEmail should be called', async () => {
//             const login = 'Petro';
//             const email = 'petro@gmail.com';
//             const password = '12345';
//             const result = await authService.createUser(login, email, password);
//
//             expect(emailAdapterMock.sendEmail).toHaveBeenCalled()
//         })
//         it("should return correct created user", async () => {
//             const login = 'Petro1';
//             const email = 'petro1@gmail.com';
//             const password = '12345';
//             const result = await authService.createUser(login, email, password);
//
//             console.log("RESULT IN TEST:", result);
//             console.log("INPUTS:", { login, email, password });
//
//             expect(result!.accountData.email).toBe(email)
//             expect(result!.accountData.userName).toBe(login)
//             expect(result!.loginAttempts.length).toBe(0)
//             expect(result!.emailConfirmation.isConfirmed).toBe(false)
//         })
//         it("should return null because duplicated email", async () => {
//             const email = 'petro@gmail.com';
//             const password = '12345';
//             const login = 'xxx';
//
//             const result = await authService.createUser(login, email, password);
//
//             expect(result).toBeNull()
//         })
//
//         it("should return null because duplicated login", async () => {
//             const login = 'Petro';
//             const password = '12345';
//             const email = 'xxxx@gmail.com';
//
//             const result = await authService.createUser(login, email, password);
//
//             expect(result).toBeNull()
//         })
//     })
//
//     describe("confirmEmail", () => {
//         beforeAll(async () => {
//             await mongoose.connection.dropDatabase()
//         })
//
//         const createUser = ({confirmationCode, expirationDate, email}: {confirmationCode: string, expirationDate: Date, email: string}) => {
//             return {
//                 _id: new ObjectId(),
//                 emailConfirmation: {
//                     isConfirmed: false,
//                     confirmationCode,
//                     expirationDate,
//                     sentEmails: []
//                 },
//                 loginAttempts: [],
//                 accountData: {
//                     email,
//                     userName: '',
//                     passwordHash: '',
//                     createdAt: new Date(),
//                 }
//             }
//         }
//
//         it("should return false for expired information code", async () => {
//             const code = 'superCode';
//             const email = 'x321fdsx@gmail.com';
//             const user = createUser({email, expirationDate: addMinutes(new Date(), -1), confirmationCode: code});
//
//             await UserModel.insertMany([user])
//
//             const result = await authService.confirmEmail(code, email);
//
//             expect(result).toBeFalsy()
//         })
//
//         it("should return false for not existed confirmation code", async () => {
//             const code = 'superCode';
//             const email = 'x321fdsx@gmail.com';
//
//             const user = createUser({confirmationCode: code, expirationDate: addMinutes(new Date(), +1), email})
//
//             const spy = jest.spyOn(usersRepository, 'updateConfirmation')
//
//             await UserModel.insertMany([user])
//
//             const result = await authService.confirmEmail('tretjerio', email);
//
//             expect(result).toBeFalsy()
//             expect(spy).not.toHaveBeenCalled()
//         })
//
//         it("should return true for existing and not existed confirmation code", async () => {
//             const code = 'superPuper';
//             const email = 'x321fdsxss@gmail.com';
//
//             const user = createUser({confirmationCode: code, email, expirationDate: addMinutes(new Date(), +10)})
//
//             await UserModel.insertMany([user])
//
//             const result = await authService.confirmEmail(code, email);
//
//             expect(result).toBeTruthy()
//
//             const userModal = await UserModel.findOne({_id: user._id})
//
//             expect(userModal!.emailConfirmation.isConfirmed).toBeTruthy()
//         })
//
//     })
//
//
// })