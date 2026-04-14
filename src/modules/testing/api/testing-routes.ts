import {Request, Response, Router} from "express";
import {TestingRepositories} from "../infrastructure/testing-repositories";

const testingRepositories = new TestingRepositories()

export const testingRouter = Router({})

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await testingRepositories.removeAllData()

    res.status(204).send()
})
