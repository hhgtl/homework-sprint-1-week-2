import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {UsersService} from "../../domain/users-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";

const usersService = new UsersService()

export const deleteUserByIdHandler = async (req: Request, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const payload = await usersService.deleteUserById(_id)

    if (payload.status === HttpStatuses.NoContent) {
        res.status(payload.status).send()
    }

    res.status(HttpStatuses.NotFound).send()
}