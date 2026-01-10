import {Request, Response, Router} from "express";
import {testingRepositories} from "../repositories/testing-repositories";

export const testingRouter = Router({})

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await testingRepositories.removeAllVideo()

    res.status(204).send()
})
