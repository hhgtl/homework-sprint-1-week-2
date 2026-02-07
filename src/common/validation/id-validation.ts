import {param} from "express-validator";

export const idValidation = param('id')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Id should be a string')
    .isMongoId()
    .withMessage('Id should be a mongoId')