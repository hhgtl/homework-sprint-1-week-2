import {randomUUID} from "crypto";
import {BlogsRepositories} from "../infrastructure/blogs-repositories";
import {ObjectId} from "mongodb";

export class BlogsService {
    private blogsRepositories = new BlogsRepositories()

    async createBlog({name, description, websiteUrl}: {name: string, description: string, websiteUrl: string}) {
        const newBlog = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString(),
        }

        return await this.blogsRepositories.createBlog(newBlog)
    }
    async changeBlogById(_id: ObjectId, body: {name: string, description: string, websiteUrl: string}) {
        const payload = {
            websiteUrl: body.websiteUrl,
            name: body.name,
            description: body.description,
        }
        return this.blogsRepositories.changeBlogById(_id, payload)
    }
    async removeBlogById(_id: ObjectId) {
        return this.blogsRepositories.removeBlogById(_id)
    }
    async createPostsByBlogId({title, shortDescription, content, blogId}: {title: string, shortDescription: string, content: string, blogId: ObjectId}) {
        const blog = await this.blogsRepositories.findBlogById(blogId)
        const blogName = blog && !Array.isArray(blog) ? blog.name : ''

        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString(),
        }

        return await this.blogsRepositories.createPostsByBlogId(newPost)
    }
}
