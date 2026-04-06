// import {rateLimitService} from "./rate-limit-service";
// import {client} from "../../../db/db";
// import {testingRepositories} from "../../testing/infrastructure/testing-repositories";
//
// describe('unit tests for auth-service', () => {
//     beforeAll(async () => {
//         // await client.connect();
//         await testingRepositories.removeAllData()
//     })
//
//     afterAll(async () => {
//         // await client.close();
//     });
//
//
//     it('checkRateLimit should return true', async () => {
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//
//         const isThrottled = await rateLimitService.checkRateLimit({url: 'someUrl', ip: '111.111'})
//
//         expect(isThrottled).toBe(true)
//     })
//
//     it('checkRateLimit should return false', async () => {
//         await testingRepositories.removeAllData()
//
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//         await rateLimitService.addToRateLimit({url: 'someUrl', ip: '111.111'})
//
//         const isThrottled = await rateLimitService.checkRateLimit({url: 'someUrl', ip: '111.111'})
//
//         expect(isThrottled).toBe(false)
//     })
//
// })