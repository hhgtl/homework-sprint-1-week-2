import {Request, Response} from "express";
import {getPaginationWithSortFields} from "../../../../common/utils/get-pagination-with-sort-fields";
import {blogsRepositoriesQuery} from "../../infrastructure/blogs-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const getAllBlogsHandler = async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : ''

    const allBlogs = await blogsRepositoriesQuery.getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize})

    res.status(HttpStatuses.Success).send(allBlogs)
}