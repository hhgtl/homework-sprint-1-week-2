import {Router} from "express";
import {authMiddleware} from "../../../common/middleware/auth-middleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {titleValidation} from "../../../common/validation/title-validation";
import {shortDescriptionValidation} from "../../../common/validation/short-description-validation";
import { contentValidation } from "../../../common/validation/content-validation";
import { blogIdValidation } from "../../../common/validation/blogId-validation";
import {paginationQueryValidation} from "../../../common/validation/pagination-query-validation";
import {idValidation} from "../../../common/validation/id-validation";
import {authJwtMiddleware} from "../../../common/middleware/authJwtMiddleware";
import {postIdValidation} from "../validation/postIdValidation";
import {commentsContentValidation} from "../../comments/validation/comments-content-validation";
import {getCommentsByPostIdHandler} from "./handlers/get-comments-by-post-id-handler";
import {createNewCommentByPostIdHandler} from "./handlers/create-new-comment-by-post-id-handler";
import {deletePostByPostIdHandler} from "./handlers/delete-post-by-post-id-handler";
import {changePostByIdHandler} from "./handlers/change-post-by-id-handler";
import {getPostByIdHandler} from "./handlers/get-post-by-id-handler";
import {createNewPostHandler} from "./handlers/create-new-post-handler";
import {getAllPostsHandler} from "./handlers/get-all-posts-handler";

export const postsRouter = Router({})

export const postQueryValidation = [
    ...paginationQueryValidation,
    inputValidationMiddleware
];

postsRouter.get("/", postQueryValidation, getAllPostsHandler)

postsRouter.post("/",
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    createNewPostHandler)


postsRouter.get("/:id", idValidation, getPostByIdHandler)

postsRouter.put("/:id",
    authMiddleware,
    idValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    changePostByIdHandler)

postsRouter.delete("/:id",
    authMiddleware,
    idValidation,
    deletePostByPostIdHandler)


postsRouter.get("/:postId/comments",
    postIdValidation,
    ...paginationQueryValidation,
    inputValidationMiddleware,
    getCommentsByPostIdHandler)

postsRouter.post("/:postId/comments",
    authJwtMiddleware,
    commentsContentValidation,
    postIdValidation,
    inputValidationMiddleware,
    createNewCommentByPostIdHandler)
