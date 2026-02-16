import {param} from "express-validator";

export const commentIdValidation = param('commentId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('CommentId should be a string')
    .isMongoId()
    .withMessage('CommentId should be a mongoId')