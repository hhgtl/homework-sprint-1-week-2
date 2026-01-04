import {Request, Response, Router} from "express";
import {testingRepositories} from "../repositories/testing-repositories";

export const testingRouter = Router({})

testingRouter.delete("/all-data", (req: Request, res: Response) => {
    testingRepositories.removeAllVideo()

    res.status(204).send()
})
