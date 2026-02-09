import {body} from "express-validator";

export const loginValidation = body('login')
    .isString()
    .trim()
    .isLength({min: 1})
    .withMessage('Login is required')
    .isLength({ min: 3, max: 10 })
    .withMessage('Login should be a string with min length 3 and max length 10')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Login should has ^[a-zA-Z0-9_-]*$')