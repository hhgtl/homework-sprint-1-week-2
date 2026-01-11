import {randomUUID} from "crypto";
import {blogsRepositories} from "../repositories/blogs-repositories";

export const blogsService = {
    async getAllBlogs() {
        return await blogsRepositories.getAllBlogs()
    },
    async createBlog({name, description, websiteUrl}: {name: string, description: string, websiteUrl: string}) {
        const newBlog = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString(),
        }

        return await blogsRepositories.createBlog(newBlog)
    },
    async findBlogById(id: string) {
        return await blogsRepositories.findBlogById(id)
    },
    async changeBlogById(id: string, body: {name: string, description: string, websiteUrl: string}) {
        const payload = {
            websiteUrl: body.websiteUrl,
            name: body.name,
            description: body.description,
        }
        return blogsRepositories.changeBlogById(id, payload)
    },
    async removeBlogById(id: string) {
        return blogsRepositories.removeBlogById(id)
    }
}