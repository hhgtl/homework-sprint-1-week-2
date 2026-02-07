import {body} from "express-validator";

export const descriptionValidation = body('description')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description should be a string with max length 500');