import {Router} from "express";
import {blogsRepositories} from "../repositories/blogs-repositories";
import {body, FieldValidationError, param, validationResult} from "express-validator";
import { Request } from 'express'
import {authMiddleware} from "../middleware/auth-middleware";

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


blogsRouter.get("/", async (req, res) => {
    const allBlogs = await blogsRepositories.getAllBlogs()

    res.status(200).send(allBlogs)
})

blogsRouter.post("/",
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    async (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const websiteUrl = req.body.websiteUrl;
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const newBlog = await blogsRepositories.createBlog({description, name, websiteUrl});
            res.status(201).send(newBlog);
        } else {
            const formatter = (error: FieldValidationError) => {
                return {
                    message: error.msg,
                    field: error.path
                };
            };
            const result = validationResult(req);
            const errors = result.array({ onlyFirstError: true }) as FieldValidationError[];

            const errorsMessages = errors.map(formatter);

            res.status(400).send({
                "errorsMessages": errorsMessages
            })
        }
})

blogsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    const blog = await blogsRepositories.findBlogById(id);

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
    (req: Request<{ id: string }>, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const errors = validationResult(req);


    if (errors.isEmpty()) {
        const blog = blogsRepositories.changeBlogById(id, {name, description, websiteUrl});

        if (blog) {
            res.status(204).send(blog)
        } else {
            res.status(404).send()
        }
    } else {
        const formatter = (error: FieldValidationError) => {
            return {
                message: error.msg,
                field: error.path
            };
        };
        const result = validationResult(req);
        const errors = result.array({ onlyFirstError: true }) as FieldValidationError[];

        const errorsMessages = errors.map(formatter);

        res.status(400).send({
            "errorsMessages": errorsMessages
        })
    }


})

blogsRouter.delete("/:id",
    authMiddleware,
    (req, res) => {
    const id = req.params.id;

    const blog = blogsRepositories.removeBlogById(id);

    if (blog) {
        res.status(204).send()
    } else {
        res.status(404).send()
    }
})
