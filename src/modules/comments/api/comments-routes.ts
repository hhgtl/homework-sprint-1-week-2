import {Router} from "express";
import {contentValidation} from "../../../common/validation/content-validation";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {commentIdValidation} from "../validation/commentId-validation";
import {authJwtMiddleware} from "../../../common/middleware/authJwtMiddleware";
import {ObjectId} from "mongodb";
import {commentsService} from "../domain/comments-service";

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

    return res.status(200).send(payload);



})

//
// commentsRoutes.delete((req,res)=> {})
//
//
// commentsRoutes.get((req,res)=> {})