import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {blogsService} from "../../domain/blogs-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const changeBlogByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
    const _id = new ObjectId(req.params.id);
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const blog = await blogsService.changeBlogById(_id, {name, description, websiteUrl});
    if (blog) {
        res.status(HttpStatuses.NoContent).send(blog)
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
}