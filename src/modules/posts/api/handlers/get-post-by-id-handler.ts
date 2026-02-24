import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {postsRepositoriesQuery} from "../../infrastructure/posts-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const getPostByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const blog = await postsRepositoriesQuery.findPostsById(_id);

    if (blog) {
        res.status(HttpStatuses.Success).send(blog)
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
}