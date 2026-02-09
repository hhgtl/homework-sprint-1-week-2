import {body} from "express-validator";

export const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 3 characters and not long 10 characters')
