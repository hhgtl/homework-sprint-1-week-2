import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {postsService} from "../../domain/posts-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {postsRepositoriesQuery} from "../../infrastructure/posts-repositories-query";

export const createNewPostHandler = async (req: Request, res: Response) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = new ObjectId(req.body.blogId);

    const postId = await postsService.createPosts({title, blogId, content, shortDescription})

    if (!postId) {
        return res.status(HttpStatuses.ServerError).send();
    }

    const newPosts = await postsRepositoriesQuery.findPostsById(postId);

    if (!newPosts) {
        return res.status(HttpStatuses.ServerError).send();
    }

    res.status(HttpStatuses.Created).send(newPosts);
}