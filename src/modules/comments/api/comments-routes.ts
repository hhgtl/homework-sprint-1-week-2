import {Router} from "express";
import {contentValidation} from "../../../common/validation/content-validation";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {commentIdValidation} from "../validation/commentId-validation";
import {authJwtMiddleware} from "../../../common/middleware/authJwtMiddleware";
import {ObjectId} from "mongodb";
import {commentsService} from "../domain/comments-service";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {commentsRepositories} from "../infrastructure/comments-repositories";

export const commentsRoutes = Router({})


commentsRoutes.put("/:commentId",
    authJwtMiddleware,
    contentValidation,
    commentIdValidation,
    inputValidationMiddleware,
    async (req,res)=> {
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


})

//
commentsRoutes.delete("/:commentId",
    authJwtMiddleware,
    commentIdValidation,
    inputValidationMiddleware,
    async (req,res)=> {
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
})

commentsRoutes.get("/:commentId",
    commentIdValidation,
    inputValidationMiddleware,
    async (req,res)=> {
        const commentId = new ObjectId(req.params.commentId);
        const comment = await commentsRepositories.findCommentById(commentId);

        if (!comment) {
            return res.status(HttpStatuses.NotFound).send();
        }

        return res.status(HttpStatuses.Success).send(comment);
    }
)