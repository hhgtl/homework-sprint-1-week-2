import {Router} from "express";
import {blogsRepositories} from "../repositories/blogs-repositories";
import {body, FieldValidationError, param, query, validationResult} from "express-validator";
import { Request, Response } from 'express'
import {authMiddleware} from "../middleware/auth-middleware";
import {blogsService} from "../services/blogs-service";
import {inputValidationMiddleware} from "../middleware/inputValidationMiddleware";

export const blogsRouter = Router({})

export const idValidation = param('id')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Id should be a string')

export const nameValidation = body('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Name should be a string with max length 15');

export const descriptionValidation = body('description')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description should be a string with max length 500');

export const websiteUrlValidation = body('websiteUrl')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Website URL max length is 100')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Invalid URL pattern');

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

    res.status(200).send(res.status(200).send({
        pagesCount: pageNumber,
        page: Array.isArray(allBlogs) ? Math.ceil(allBlogs.length  / pageSize) : 1 ,
        pageSize: pageSize,
        totalCount: Array.isArray(allBlogs) ? allBlogs.length : 1 ,
        items: allBlogs,
    }))
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
        res.status(201).send(newBlog);
})

blogsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    const blog = await blogsService.findBlogById(id);

    if (blog) {
        res.status(200).send(blog)
    } else {
        res.status(404).send()
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
        res.status(204).send(blog)
    } else {
        res.status(404).send()
    }
    })

blogsRouter.delete("/:id",
    authMiddleware,
    async (req, res) => {
    const id = req.params.id;

    const blog = await blogsService.removeBlogById(id);

    if (blog) {
        res.status(204).send()
    } else {
        res.status(404).send()
    }
})


blogsRouter.get("/:blogId/posts", async (req, res) => {
    const blogId = req.params.blogId
    const posts = await blogsService.findBlogPostById(blogId)

    if (!posts) {
        res.sendStatus(404)
        return
    }

    res.status(200).send(posts)
})