import {body} from "express-validator";

export const blogIdValidation = body('blogId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('BlogId is required and must be a string')