import {Request, Response} from "express";
import {getPaginationWithSortFields} from "../../../../common/utils/get-pagination-with-sort-fields";
import {ObjectId} from "mongodb";
import {postsRepositoriesQuery} from "../../infrastructure/posts-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {commentsRepositoriesQuery} from "../../../comments/infrastructure/comments-repositories-query";

export const getCommentsByPostIdHandler = async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);
    const postId = new ObjectId(req.params.postId);

    const post = await postsRepositoriesQuery.findPostsById(postId);

    if (!post) {
        return res.status(HttpStatuses.NotFound).send();
    }

    const comments = await commentsRepositoriesQuery.findCommentByPostId({sortBy, sortDirection, pageNumber, pageSize, postId})

    res.status(HttpStatuses.Success).send(comments)
}