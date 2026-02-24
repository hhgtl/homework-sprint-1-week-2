import {Request, Response} from "express";
import {getPaginationWithSortFields} from "../../../../common/utils/get-pagination-with-sort-fields";
import {postsRepositoriesQuery} from "../../infrastructure/posts-repositories-query";
import {HttpStatuses} from "../../../../common/types/http-statuses";

export const getAllPostsHandler = async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = getPaginationWithSortFields(req.query);

    const posts = await postsRepositoriesQuery.getAllPosts({sortBy, sortDirection, pageSize, pageNumber});

    res.status(HttpStatuses.Success).send(posts)
}