import {query} from "express-validator";

export const paginationQueryValidation = [
    query('sortDirection')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('sortDirection must be asc or desc')
        .default('desc'),

    query('sortBy')
        .optional()
        .isString()
        .trim()
        .default('createdAt'),

    query('pageNumber')
        .optional()
        .isString()
        .trim()
        .isInt()
        .default(1),

    query('pageSize')
        .optional()
        .isString()
        .trim()
        .isInt()
        .default(10)
];