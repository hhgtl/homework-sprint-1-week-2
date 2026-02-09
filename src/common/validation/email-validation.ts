import {body} from "express-validator";

export const emailValidation = body('email')
    .isString()
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage('Invalid email pattern');