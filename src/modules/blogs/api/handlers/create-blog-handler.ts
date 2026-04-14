import {Request, Response} from "express";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {BlogsService} from "../../domain/blogs-service";
import {BlogsRepositoriesQuery} from "../../infrastructure/blogs-repositories-query";

const blogsService = new BlogsService()
const blogsRepositoriesQuery = new BlogsRepositoriesQuery()

export const createBlogHandler = async (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const blogId = await blogsService.createBlog({description, name, websiteUrl});

    const blog = await blogsRepositoriesQuery.findBlogById(blogId)

    res.status(HttpStatuses.Created).send(blog);
}