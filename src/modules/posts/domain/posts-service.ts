import {postsRepositories} from "../infrastructure/posts-repositories";
import {blogsRepositories} from "../../blogs/infrastructure/blogs-repositories";
import {ObjectId} from "mongodb";

export const postsService = {
    async createPosts({title, shortDescription, content, blogId}: {title: string, shortDescription: string, content: string, blogId: ObjectId}) {
        const blog = await blogsRepositories.findBlogById(blogId)
        const blogName = blog && !Array.isArray(blog) ? blog.name : ''

        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString(),
        }

        return await postsRepositories.createPosts(newPost)
    },
    async changePostsById(_id: ObjectId, body: {title: string, shortDescription: string, content: string, blogId: ObjectId}) {
        const payload = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
        }

        return await postsRepositories.changePostsById(_id, payload)
    },
    async removePostsById(_id: ObjectId) {
        return postsRepositories.removePostsById(_id)
    }
}