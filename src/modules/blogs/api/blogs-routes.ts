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

export const blogsRouter = Router({})

export const blogsQueryValidation = [
    query('sortDirection')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('sortDirection must be asc or desc'),

    query('sortBy')
        .optional()
        .isString()
        .trim(),

    query('searchNameTerm')
        .optional()
        .isString()
        .trim(),

    query('pageNumber')
        .optional()
        .isString()
        .trim(),

    query('pageSize')
        .optional()
        .isString()
        .trim(),
    inputValidationMiddleware
];

export type SortDirection = 'asc' | 'desc';

blogsRouter.get("/", blogsQueryValidation, async (req: Request, res: Response) => {
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;

    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc' as SortDirection;

    const allBlogs = await blogsService.getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize})

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

        const newBlog = await blogsService.createBlog({description, name, websiteUrl});
        res.status(HttpStatuses.Created).send(newBlog);
})

blogsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    const blog = await blogsService.findBlogById(id);

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
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const blog = await blogsService.changeBlogById(id, {name, description, websiteUrl});
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
    const id = req.params.id;

    const blog = await blogsService.removeBlogById(id);

    if (blog) {
        res.status(HttpStatuses.NoContent).send()
    } else {
        res.status(HttpStatuses.NotFound).send()
    }
})


blogsRouter.get("/:blogId/posts", async (req, res) => {
    const blogId = req.params.blogId
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc' as SortDirection;

    const posts = await blogsService.findBlogPostById({blogId, sortBy, sortDirection, pageNumber, pageSize})

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
        const blogId = req.params.id

        const newPosts = await blogsService.createPostsByBlogId({title, blogId, content, shortDescription})

        if (newPosts) {
            res.status(HttpStatuses.Created).send(newPosts);
        }

        res.status(HttpStatuses.NotFound).send()

    })