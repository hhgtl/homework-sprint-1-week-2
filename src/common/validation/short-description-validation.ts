import {body} from "express-validator";

export const shortDescriptionValidation = body('shortDescription')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Short description should be a string with max length 100')