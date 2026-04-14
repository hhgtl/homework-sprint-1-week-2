import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {BlogsRepositoriesQuery} from "../../infrastructure/blogs-repositories-query";

const blogsRepositoriesQuery = new BlogsRepositoriesQuery()

export const getBlogByIdHandler = async (req: Request<{id: string}>, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const blog = await blogsRepositoriesQuery.findBlogById(_id);

    if (blog) {
        res.status(HttpStatuses.Success).send(blog)
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
}