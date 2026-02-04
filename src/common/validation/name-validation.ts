import {body} from "express-validator";

export const nameValidation = body('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Name should be a string with max length 15');