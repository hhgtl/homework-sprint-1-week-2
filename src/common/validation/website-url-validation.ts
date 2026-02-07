import {body} from "express-validator";

export const websiteUrlValidation = body('websiteUrl')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Website URL max length is 100')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Invalid URL pattern');