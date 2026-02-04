import {Request, Response, Router} from "express";
import {body, FieldValidationError, query, validationResult} from "express-validator";
import {authMiddleware} from "../../../middleware/auth-middleware";
import {postsService} from "../domain/posts-service";
import {inputValidationMiddleware} from "../../../middleware/inputValidationMiddleware";
import {SortDirection} from "../../blogs/api/blogs-routes";
import {HttpStatuses} from "../../../common/types/http-statuses";

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


postsRouter.get("/", blogsQueryValidation, async (req: Request, res: Response) => {
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;

    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc' as SortDirection;

    const posts = await postsService.getAllPosts({sortBy, sortDirection, pageSize, pageNumber});

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

    const blog = await postsService.findPostsById(id);

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
