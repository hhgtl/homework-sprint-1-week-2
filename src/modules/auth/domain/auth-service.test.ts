import {testingRepositories} from "../../testing/infrastructure/testing-repositories";
import {client} from "../../../db/db";


describe('integration tests for auth-service', () => {

    describe('create blogs', () => {
        beforeAll(async () => {
            await testingRepositories.removeAllData()
        })

        afterAll(async () => {
            await client.close();
        });

        it('', async () => {

        });
    })

})