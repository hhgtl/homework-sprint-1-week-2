import {body} from "express-validator";

export const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Password must be at least 3 characters and not long 10 characters')
