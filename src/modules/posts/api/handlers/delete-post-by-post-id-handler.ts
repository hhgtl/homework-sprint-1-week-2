import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {postsService} from "../../domain/posts-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";


export const deletePostByPostIdHandler = async (req: Request, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const post = await postsService.removePostsById(_id);

    if (post) {
        res.status(HttpStatuses.NoContent).send()
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
}