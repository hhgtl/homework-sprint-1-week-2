import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {CommentsService} from "../../domain/comments-service";

const commentsService = new CommentsService()

export const deleteCommentByIdHandler = async (req: Request, res: Response)=> {
    const commentId = new ObjectId(req.params.commentId);
    const userId = new ObjectId(req.userId);

    const payload = await commentsService.deleteComment({commentId, userId});

    if (payload.status === HttpStatuses.Success) {
        return res.status(HttpStatuses.NoContent).send();
    } else if (payload.status === HttpStatuses.NotFound) {
        return res.status(HttpStatuses.NotFound).send();
    } else if (payload.status === HttpStatuses.Forbidden) {
        return res.status(HttpStatuses.Forbidden).send();
    }
}