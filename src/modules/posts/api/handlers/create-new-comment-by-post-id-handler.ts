import {ObjectId} from "mongodb";
import {postsRepositoriesQuery} from "../../infrastructure/posts-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {usersRepositoriesQuery} from "../../../users/infrastructure/users-repositories-query";
import {commentsService} from "../../../comments/domain/comments-service";
import {commentsRepositoriesQuery} from "../../../comments/infrastructure/comments-repositories-query";
import {Request, Response} from "express";

export const createNewCommentByPostIdHandler = async (req: Request, res: Response) => {
    const content = req.body.content;
    const userId = new ObjectId(req?.userId);
    const postId = new ObjectId(req.params.postId)

    const post = await postsRepositoriesQuery.findPostsById(postId);

    if (!post) {
        return res.status(HttpStatuses.NotFound).send();
    }

    if (!userId) {
        return res.status(HttpStatuses.BadRequest).send();
    }

    const userInfo = await usersRepositoriesQuery.findUserById(userId);

    if (!userInfo) {
        return res.status(HttpStatuses.BadRequest).send();
    }

    const createdCommentId = await commentsService.createNewComment({postId, content, userId, userLogin: userInfo.login})

    const comment = await commentsRepositoriesQuery.findCommentById(createdCommentId);

    if (!comment) {
        return res.status(HttpStatuses.BadRequest).send();
    }

    res.status(HttpStatuses.Created).send(comment);
}