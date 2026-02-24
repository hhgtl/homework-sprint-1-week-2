import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {usersService} from "../../domain/users-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const deleteUserByIdHandler = async (req: Request, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const payload = await usersService.deleteUserById(_id)

    if (payload.status === HttpStatuses.NoContent) {
        res.status(payload.status).send()
    }

    res.status(HttpStatuses.NotFound).send()
}