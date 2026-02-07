import {Request, Response, Router} from "express";
import {authMiddleware} from "../../../common/middleware/auth-middleware";
import {postsService} from "../domain/posts-service";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {titleValidation} from "../../../common/validation/title-validation";
import {shortDescriptionValidation} from "../../../common/validation/short-description-validation";
import { contentValidation } from "../../../common/validation/content-validation";
import { blogIdValidation } from "../../../common/validation/blogId-validation";
import {getPaginationWithSortFields} from "../../../common/utils/get-pagination-with-sort-fields";
import {postsRepositoriesQuery} from "../infrastructure/posts-repositories-query";
import {paginationQueryValidation} from "../../../common/validation/pagination-query-validation";
import {ObjectId} from "mongodb";
import {idValidation} from "../../../common/validation/id-validation";

export const postsRouter = Router({})

export const postQueryValidation = [
    ...paginationQueryValidation,
    inputValidationMiddleware
];

postsRouter.get("/", postQueryValidation, async (req: Request, res: Response) => {
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
        const blogId = new ObjectId(req.body.blogId);

        const postId = await postsService.createPosts({title, blogId, content, shortDescription})

        if (!postId) {
            return res.status(HttpStatuses.ServerError).send();
        }

        const newPosts = await postsRepositoriesQuery.findPostsById(postId);

        if (!newPosts) {
            return res.status(HttpStatuses.ServerError).send();
        }

        res.status(HttpStatuses.Created).send(newPosts);
    })


postsRouter.get("/:id", idValidation, async (req: Request<{ id: string }>, res) => {
    const _id = new ObjectId(req.params.id);

    const blog = await postsRepositoriesQuery.findPostsById(_id);

    if (blog) {
        res.status(HttpStatuses.Success).send(blog)
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
})

postsRouter.put("/:id",
    authMiddleware,
    idValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request<{ id: string }>, res) => {
        const _id = new ObjectId(req.params.id);
        const title = req.body.title;
        const shortDescription = req.body.shortDescription;
        const content = req.body.content;
        const blogId = req.body.blogId;

        const newPosts = await postsService.changePostsById(_id, {title, blogId, content, shortDescription})
        if (newPosts) {
            res.status(HttpStatuses.NoContent).send();
        } else {
            res.status(HttpStatuses.NotFound).send()
        }
    })

postsRouter.delete("/:id",
    authMiddleware,
    idValidation,
    async (req, res) => {
    const _id = new ObjectId(req.params.id);

    const post = await postsService.removePostsById(_id);

    if (post) {
        res.status(HttpStatuses.NoContent).send()
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
})
