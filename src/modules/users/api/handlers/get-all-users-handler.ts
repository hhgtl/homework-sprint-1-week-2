import {Request, Response} from "express";
import {getPaginationWithSortFields} from "../../../../common/utils/get-pagination-with-sort-fields";
import {usersRepositoriesQuery} from "../../infrastructure/users-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const getAllUsersHandler = async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);
    const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null
    const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null

    const allUsers = await usersRepositoriesQuery.getAllUsers({sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm})
    res.status(HttpStatuses.Success).send(allUsers)
}