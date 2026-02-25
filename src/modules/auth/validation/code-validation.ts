import {body} from "express-validator";

export const codeValidation = body('code')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Code is required')