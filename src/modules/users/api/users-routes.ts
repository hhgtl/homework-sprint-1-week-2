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

usersRouter.get('/', authMiddleware, usersQueryValidation, async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);
    const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null
    const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null

    const allUsers = await usersRepositoriesQuery.getAllUsers({sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm})
    res.status(HttpStatuses.Success).send(allUsers)
})


usersRouter.post('/', authMiddleware, loginValidation, passwordValidation, emailValidation, inputValidationMiddleware, async (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;

    const payload = await usersService.createUser({login, email, password})

    if (payload.status !== HttpStatuses.Success) {
        return res.status(payload.status).send(payload.extensions)
    }

    if (payload.status === HttpStatuses.Success && payload.data !== null) {
        const user = await usersRepositoriesQuery.findUserById(payload.data)

        res.status(HttpStatuses.Created).send(user)
    }

    return res.status(HttpStatuses.ServerError)
})


usersRouter.delete('/:id', authMiddleware, idValidation, async (req: Request, res: Response) => {
    const _id = new ObjectId(req.params.id);

    const isDeleted = await usersService.deleteUserById(_id)

    if (isDeleted) {
        res.status(HttpStatuses.NoContent).send()
    }

    res.status(HttpStatuses.NotFound).send()
})