import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {PostsService} from "../../domain/posts-service";

const postsService = new PostsService()

export const changePostByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
    const _id = new ObjectId(req.params.id);
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;

    const newPosts = await postsService.changePostsById(_id, {title, blogId, content, shortDescription})
    if (newPosts) {
        res.status(HttpStatuses.NoContent).send();
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
}