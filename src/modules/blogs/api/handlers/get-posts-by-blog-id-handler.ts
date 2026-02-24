import {Request, Response} from "express";
import {getPaginationWithSortFields} from "../../../../common/utils/get-pagination-with-sort-fields";
import {ObjectId} from "mongodb";
import {blogsRepositoriesQuery} from "../../infrastructure/blogs-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const getPostsByBlogIdHandler = async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);
    const blogId = new ObjectId(req.params.blogId)

    const posts = await blogsRepositoriesQuery.findBlogPostById({blogId, sortBy, sortDirection, pageNumber, pageSize})

    if (Array.isArray(posts?.items) && !posts?.items.length) {
        res.sendStatus(HttpStatuses.NotFound)
        return
    }

    res.status(HttpStatuses.Success).send(posts)
}