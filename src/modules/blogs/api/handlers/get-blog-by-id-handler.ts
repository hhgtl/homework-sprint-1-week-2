import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {blogsRepositoriesQuery} from "../../infrastructure/blogs-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const getBlogByIdHandler = async (req: Request<{id: string}>, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const blog = await blogsRepositoriesQuery.findBlogById(_id);

    if (blog) {
        res.status(HttpStatuses.Success).send(blog)
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
}