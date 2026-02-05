import {randomUUID} from "crypto";
import {postsRepositories} from "../infrastructure/posts-repositories";
import {blogsRepositories} from "../../blogs/infrastructure/blogs-repositories";
import {SortDirection} from "../../blogs/api/blogs-routes";
import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";

export const postsService = {
    async createPosts({title, shortDescription, content, blogId}: {title: string, shortDescription: string, content: string, blogId: string}) {
        const blog = await blogsRepositories.findBlogById(blogId)
        const blogName = blog && !Array.isArray(blog) ? blog.name : ''

        const newPost = {
            id: randomUUID(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString(),
        }

        return await postsRepositories.createPosts(newPost)
    },
    async changePostsById(id: string, body: {title: string, shortDescription: string, content: string, blogId: string}) {
        const payload = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
        }

        return await postsRepositories.changePostsById(id, payload)
    },
    async removePostsById(id: string) {
        return postsRepositories.removePostsById(id)
    }
}