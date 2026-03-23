import {param} from "express-validator";

export const deviceIdValidation = param('deviceId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Id should be a string')
    .isUUID()
    .withMessage('Id should be a mongoId')