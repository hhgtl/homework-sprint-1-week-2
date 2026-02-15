import {body} from "express-validator";

export const contentValidation = body('content')
    .isString()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage('Content should be a string with max length 500')