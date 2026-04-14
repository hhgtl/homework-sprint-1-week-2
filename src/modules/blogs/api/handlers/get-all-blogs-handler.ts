import {Request, Response} from "express";
import {getPaginationWithSortFields} from "../../../../common/utils/get-pagination-with-sort-fields";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {BlogsRepositoriesQuery} from "../../infrastructure/blogs-repositories-query";

const blogsRepositoriesQuery = new BlogsRepositoriesQuery()

export const getAllBlogsHandler = async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : ''

    const allBlogs = await blogsRepositoriesQuery.getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize})

    res.status(HttpStatuses.Success).send(allBlogs)
}