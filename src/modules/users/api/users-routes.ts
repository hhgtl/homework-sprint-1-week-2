import {Request, Response, Router} from "express";
import {paginationQueryValidation} from "../../../common/validation/pagination-query-validation";
import {query} from "express-validator";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";
import {authMiddleware} from "../../../common/middleware/auth-middleware";
import {usersRepositoriesQuery} from "../infrastructure/users-repositories-query";
import {getPaginationWithSortFields} from "../../../common/utils/get-pagination-with-sort-fields";
import {loginValidation} from "../../../common/validation/login-validation";
import {passwordValidation} from "../../../common/validation/password-validation";
import {emailValidation} from "../../../common/validation/email-validation";
import {usersService} from "../domain/users-service";
import {HttpStatuses} from "../../../common/types/http-statuses";
import {idValidation} from "../../../common/validation/id-validation";
import {ObjectId} from "mongodb";
import {deleteUserByIdHandler} from "./handlers/delete-user-by-id-handler";
import {createNewUserHandler} from "./handlers/create-new-user-handler";
import {getAllUsersHandler} from "./handlers/get-all-users-handler";

export const usersRouter = Router({})

export const usersQueryValidation = [
    ...paginationQueryValidation,
    query('searchLoginTerm')
        .optional()
        .isString()
        .trim()
        .default(null),
    query('searchEmailTerm')
        .optional()
        .isString()
        .trim()
        .default(null),

    inputValidationMiddleware
];

usersRouter.get('/', authMiddleware, usersQueryValidation, getAllUsersHandler)

usersRouter.post('/', authMiddleware, loginValidation, passwordValidation, emailValidation, inputValidationMiddleware, createNewUserHandler)

usersRouter.delete('/:id', authMiddleware, idValidation, deleteUserByIdHandler)