import {Router} from "express";
import {query} from "express-validator";
import { Request, Response } from 'express'
import {authMiddleware} from "../../../common/middleware/auth-middleware";
import {blogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {descriptionValidation} from "../../../common/validation/description-validation";
import {websiteUrlValidation} from "../../../common/validation/website-url-validation";
import {nameValidation} from "../../../common/validation/name-validation";
import {idValidation} from "../../../common/validation/id-validation";
import {shortDescriptionValidation} from "../../../common/validation/short-description-validation";
import {titleValidation} from "../../../common/validation/title-validation";
import {contentValidation} from "../../../common/validation/content-validation";
import {blogsRepositoriesQuery} from "../infrastructure/blogs-repositories-query";
import {getPaginationWithSortFields} from "../../../common/utils/get-pagination-with-sort-fields";
import {paginationQueryValidation} from "../../../common/validation/pagination-query-validation";
import {ObjectId} from "mongodb";
import {postsRepositoriesQuery} from "../../posts/infrastructure/posts-repositories-query";

export const blogsRouter = Router({})

export const blogsQueryValidation = [
    ...paginationQueryValidation,
    query('searchNameTerm')
        .optional()
        .isString()
        .trim(),

    inputValidationMiddleware
];

blogsRouter.get("/", blogsQueryValidation, async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : ''

    const allBlogs = await blogsRepositoriesQuery.getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize})

    res.status(HttpStatuses.Success).send(allBlogs)
})

blogsRouter.post("/",
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const websiteUrl = req.body.websiteUrl;

        const blogId = await blogsService.createBlog({description, name, websiteUrl});

        const blog = await blogsRepositoriesQuery.findBlogById(blogId)

        res.status(HttpStatuses.Created).send(blog);
})

blogsRouter.get("/:id", idValidation, async (req: Request<{id: string}>, res) => {
    const _id = new ObjectId(req.params.id);

    const blog = await blogsRepositoriesQuery.findBlogById(_id);

    if (blog) {
        res.status(HttpStatuses.Success).send(blog)
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
})

blogsRouter.put("/:id",
    authMiddleware,
    idValidation,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: Request<{ id: string }>, res) => {
    const _id = new ObjectId(req.params.id);
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const blog = await blogsService.changeBlogById(_id, {name, description, websiteUrl});
    if (blog) {
        res.status(HttpStatuses.NoContent).send(blog)
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
    })

blogsRouter.delete("/:id",
    authMiddleware,
    idValidation,
    async (req, res) => {
    const _id = new ObjectId(req.params.id);

    const blog = await blogsService.removeBlogById(_id);

    if (blog) {
        res.status(HttpStatuses.NoContent).send()
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
})


blogsRouter.get("/:blogId/posts", async (req, res) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);
    const blogId = new ObjectId(req.params.blogId)

    const posts = await blogsRepositoriesQuery.findBlogPostById({blogId, sortBy, sortDirection, pageNumber, pageSize})

    if (Array.isArray(posts?.items) && !posts?.items.length) {
        res.sendStatus(HttpStatuses.NotFound)
        return
    }

    res.status(HttpStatuses.Success).send(posts)
})


blogsRouter.post("/:id/posts",
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    idValidation,
    inputValidationMiddleware,
    async (req, res) => {
        const title = req.body.title;
        const shortDescription = req.body.shortDescription;
        const content = req.body.content;
        const blogId = new ObjectId(req.params.id)

        const _id = await blogsService.createPostsByBlogId({title, blogId, content, shortDescription})

        if (!_id) {
            return res.status(HttpStatuses.NotFound).send()
        }

        const newPost = await postsRepositoriesQuery.findPostsById(_id)

        if (newPost) {
            res.status(HttpStatuses.Created).send(newPost);
        }

        res.status(HttpStatuses.NotFound).send()

    })