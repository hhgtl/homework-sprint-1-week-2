import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {blogsService} from "../../domain/blogs-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const deleteBlogByIdHandler = async (req: Request, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const blog = await blogsService.removeBlogById(_id);

    if (blog) {
        res.status(HttpStatuses.NoContent).send()
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
}