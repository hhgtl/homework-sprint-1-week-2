import {Router} from "express";
import {query} from "express-validator";
import {authMiddleware} from "../../../common/middleware/auth-middleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {descriptionValidation} from "../../../common/validation/description-validation";
import {websiteUrlValidation} from "../../../common/validation/website-url-validation";
import {nameValidation} from "../../../common/validation/name-validation";
import {idValidation} from "../../../common/validation/id-validation";
import {shortDescriptionValidation} from "../../../common/validation/short-description-validation";
import {titleValidation} from "../../../common/validation/title-validation";
import {contentValidation} from "../../../common/validation/content-validation";
import {paginationQueryValidation} from "../../../common/validation/pagination-query-validation";
import {createBlogHandler} from "./handlers/create-blog-handler";
import {getAllBlogsHandler} from "./handlers/get-all-blogs-handler";
import {getBlogByIdHandler} from "./handlers/get-blog-by-id-handler";
import {changeBlogByIdHandler} from "./handlers/change-blog-by-id-handler";
import {deleteBlogByIdHandler} from "./handlers/delete-blog-by-id-handler";
import {getPostsByBlogIdHandler} from "./handlers/get-posts-by-blog-id-handler";
import {createPostByBlogIdHandler} from "./handlers/create-post-by-blog-id-handler";

export const blogsRouter = Router({})

export const blogsQueryValidation = [
    ...paginationQueryValidation,
    query('searchNameTerm')
        .optional()
        .isString()
        .trim(),

    inputValidationMiddleware
];

blogsRouter.get("/", blogsQueryValidation, getAllBlogsHandler)

blogsRouter.post("/",
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    createBlogHandler)

blogsRouter.get("/:id", idValidation, getBlogByIdHandler)

blogsRouter.put("/:id",
    authMiddleware,
    idValidation,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    changeBlogByIdHandler)

blogsRouter.delete("/:id",
    authMiddleware,
    idValidation,
    deleteBlogByIdHandler)

blogsRouter.get("/:blogId/posts", getPostsByBlogIdHandler)


blogsRouter.post("/:id/posts",
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    idValidation,
    inputValidationMiddleware,
    createPostByBlogIdHandler)