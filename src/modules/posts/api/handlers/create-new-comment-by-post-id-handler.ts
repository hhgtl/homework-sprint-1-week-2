import {ObjectId} from "mongodb";
import {Request, Response} from "express";
import {PostsRepositoriesQuery} from "../../infrastructure/posts-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {UsersRepositoriesQuery} from "../../../users/infrastructure/users-repositories-query";
import {CommentsService} from "../../../comments/domain/comments-service";
import {CommentsRepositoriesQuery} from "../../../comments/infrastructure/comments-repositories-query";

const postsRepositoriesQuery = new PostsRepositoriesQuery()
const usersRepositoriesQuery = new UsersRepositoriesQuery()
const commentsService = new CommentsService()
const commentsRepositoriesQuery = new CommentsRepositoriesQuery()

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