import {Request, Router} from "express";
import {body, FieldValidationError, validationResult} from "express-validator";
import {authMiddleware} from "../middleware/auth-middleware";
import {postsService} from "../services/posts-service";

export const postsRouter = Router({})

export const titleValidation = body('title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Title should be a string with max length 30')

export const shortDescriptionValidation = body('shortDescription')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Short description should be a string with max length 100')

export const contentValidation = body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content should be a string with max length 1000')

export const blogIdValidation = body('blogId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('BlogId is required and must be a string')

postsRouter.get("/", async (req, res) => {
    const posts = await postsService.getAllPosts();

    res.status(200).send(posts)
})

postsRouter.post("/",
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    async (req, res) => {
        const title = req.body.title;
        const shortDescription = req.body.shortDescription;
        const content = req.body.content;
        const blogId = req.body.blogId;
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const newPosts = await postsService.createPosts({title, blogId, content, shortDescription})
            res.status(201).send(newPosts);
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


postsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    const blog = await postsService.findPostsById(id);

    if (blog) {
        res.status(200).send(blog)
    } else {
        res.status(404).send()
    }
})

postsRouter.put("/:id",
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    async (req: Request<{ id: string }>, res) => {
        const id = req.params.id;
        const title = req.body.title;
        const shortDescription = req.body.shortDescription;
        const content = req.body.content;
        const blogId = req.body.blogId;
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const newPosts = await postsService.changePostsById(id, {title, blogId, content, shortDescription})
            if (newPosts) {
                res.status(204).send();
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

postsRouter.delete("/:id",
    authMiddleware,
    async (req, res) => {
    const id = req.params.id;

    const post = await postsService.removePostsById(id);

    if (post) {
        res.status(204).send()
    } else {
        res.status(404).send()
    }
})
