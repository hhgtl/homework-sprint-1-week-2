import {param} from "express-validator";

export const postIdValidation = param('postId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('PostId should be a string')
    .isMongoId()
    .withMessage('PostId should be a mongoId')