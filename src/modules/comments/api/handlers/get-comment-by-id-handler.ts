import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {commentsRepositoriesQuery} from "../../infrastructure/comments-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const getCommentByIdHandler = async (req: Request, res: Response)=> {
    const commentId = new ObjectId(req.params.commentId);
    const comment = await commentsRepositoriesQuery.findCommentById(commentId);

    if (!comment) {
        return res.status(HttpStatuses.NotFound).send();
    }

    return res.status(HttpStatuses.Success).send(comment);
}