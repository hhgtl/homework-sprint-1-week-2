import {ObjectId} from "mongodb";
import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {CommentsService} from "../../domain/comments-service";

const commentsService = new CommentsService()

export const changeCommentByIdHandler = async (req: Request, res: Response)=> {
    const content = req.body.content;
    const commentId = new ObjectId(req.params.commentId);
    const userId = new ObjectId(req.userId);

    const payload = await commentsService.changeCommentById({commentId, userId, content});

    if (payload.status === HttpStatuses.Success) {
        return res.status(HttpStatuses.NoContent).send();
    } else if (payload.status === HttpStatuses.NotFound) {
        return res.status(HttpStatuses.NotFound).send();
    } else if (payload.status === HttpStatuses.Forbidden) {
        return res.status(HttpStatuses.Forbidden).send();
    }


}