import {Router} from "express";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {commentIdValidation} from "../validation/commentId-validation";
import {authJwtMiddleware} from "../../../common/middleware/authJwtMiddleware";
import {commentsContentValidation} from "../validation/comments-content-validation";
import {getCommentByIdHandler} from "./handlers/get-comment-by-id-handler";
import {deleteCommentByIdHandler} from "./handlers/delete-comment-by-id-handler";
import {changeCommentByIdHandler} from "./handlers/change-comment-by-id-handler";

export const commentsRoutes = Router({})


commentsRoutes.put("/:commentId",
    authJwtMiddleware,
    commentsContentValidation,
    commentIdValidation,
    inputValidationMiddleware,
    changeCommentByIdHandler)

commentsRoutes.delete("/:commentId",
    authJwtMiddleware,
    commentIdValidation,
    inputValidationMiddleware,
    deleteCommentByIdHandler)

commentsRoutes.get("/:commentId",
    authJwtMiddleware,
    commentIdValidation,
    inputValidationMiddleware,
    getCommentByIdHandler
)