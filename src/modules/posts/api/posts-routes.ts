import {Request, Response, Router} from "express";
import {query} from "express-validator";
import {authMiddleware} from "../../../common/middleware/auth-middleware";
import {postsService} from "../domain/posts-service";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {SortDirection} from "../../blogs/api/blogs-routes";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {titleValidation} from "../../../common/validation/title-validation";
import {shortDescriptionValidation} from "../../../common/validation/short-description-validation";
import { contentValidation } from "../../../common/validation/content-validation";
import { blogIdValidation } from "../../../common/validation/blogId-validation";
import {getPaginationWithSortFields} from "../../../common/utils/get-pagination-with-sort-fields";
import {postsRepositoriesQuery} from "../infrastructure/posts-repositories-query";

export const postsRouter = Router({})

export const blogsQueryValidation = [
    query('sortDirection')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('sortDirection must be asc or desc')
        .default('desc'),

    query('sortBy')
        .optional()
        .isString()
        .trim()
        .default('createdAt'),

    query('searchNameTerm')
        .optional()
        .isString()
        .trim(),

    query('pageNumber')
        .optional()
        .isString()
        .trim()
        .isInt()
        .default(1),

    query('pageSize')
        .optional()
        .isString()
        .trim()
        .isInt()
        .default(10),
    inputValidationMiddleware
];


postsRouter.get("/", blogsQueryValidation, async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);

    const posts = await postsRepositoriesQuery.getAllPosts({sortBy, sortDirection, pageSize, pageNumber});

    res.status(HttpStatuses.Success).send(posts)
})

postsRouter.post("/",
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req, res) => {
        const title = req.body.title;
        const shortDescription = req.body.shortDescription;
        const content = req.body.content;
        const blogId = req.body.blogId;

        const newPosts = await postsService.createPosts({title, blogId, content, shortDescription})
        res.status(HttpStatuses.Created).send(newPosts);
    })


postsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    const blog = await postsRepositoriesQuery.findPostsById(id);

    if (blog) {
        res.status(HttpStatuses.Success).send(blog)
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
})

postsRouter.put("/:id",
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request<{ id: string }>, res) => {
        const id = req.params.id;
        const title = req.body.title;
        const shortDescription = req.body.shortDescription;
        const content = req.body.content;
        const blogId = req.body.blogId;

        const newPosts = await postsService.changePostsById(id, {title, blogId, content, shortDescription})
        if (newPosts) {
            res.status(HttpStatuses.NoContent).send();
        } else {
            res.status(HttpStatuses.NotFound).send()
        }
    })

postsRouter.delete("/:id",
    authMiddleware,
    async (req, res) => {
    const id = req.params.id;

    const post = await postsService.removePostsById(id);

    if (post) {
        res.status(HttpStatuses.NoContent).send()
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
})
