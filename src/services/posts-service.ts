import {randomUUID} from "crypto";
import {postsRepositories} from "../repositories/posts-repositories";
import {blogsRepositories} from "../repositories/blogs-repositories";

export const postsService = {
    async getAllPosts() {
        return await postsRepositories.getAllPosts()
    },
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
    async findPostsById(id: string) {
        return postsRepositories.findPostsById(id)
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