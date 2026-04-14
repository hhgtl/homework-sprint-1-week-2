import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {PostsService} from "../../domain/posts-service";

const postsService = new PostsService()


export const deletePostByPostIdHandler = async (req: Request, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const post = await postsService.removePostsById(_id);

    if (post) {
        res.status(HttpStatuses.NoContent).send()
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
}