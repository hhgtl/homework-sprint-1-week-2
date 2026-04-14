import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {BlogsService} from "../../domain/blogs-service";
import {HttpStatuses} from "../../../../common/types/http-statuses";
import {PostsRepositoriesQuery} from "../../../posts/infrastructure/posts-repositories-query";

const blogsService = new BlogsService()
const postsRepositoriesQuery = new PostsRepositoriesQuery()


export const createPostByBlogIdHandler = async (req: Request, res: Response) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = new ObjectId(req.params.id)

    const _id = await blogsService.createPostsByBlogId({title, blogId, content, shortDescription})

    if (!_id) {
        return res.status(HttpStatuses.NotFound).send()
    }

    const newPost = await postsRepositoriesQuery.findPostsById(_id)

    if (newPost) {
        res.status(HttpStatuses.Created).send(newPost);
    }

    res.status(HttpStatuses.NotFound).send()

}