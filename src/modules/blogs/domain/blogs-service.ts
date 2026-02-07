import {randomUUID} from "crypto";
import {blogsRepositories} from "../infrastructure/blogs-repositories";
import {ObjectId} from "mongodb";

export const blogsService = {
    // async getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize}: GetAllBlogsQuery) {
    //     return await blogsRepositories.getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize})
    // },
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
    // async findBlogById(id: string) {
    //     return await blogsRepositories.findBlogById(id)
    // },
    async changeBlogById(_id: ObjectId, body: {name: string, description: string, websiteUrl: string}) {
        const payload = {
            websiteUrl: body.websiteUrl,
            name: body.name,
            description: body.description,
        }
        return blogsRepositories.changeBlogById(_id, payload)
    },
    async removeBlogById(_id: ObjectId) {
        return blogsRepositories.removeBlogById(_id)
    },
    // async findBlogPostById({sortBy, sortDirection, blogId, pageNumber, pageSize}: Omit<GetAllBlogsQuery, 'searchNameTerm'> & {blogId: string}) {
    //     return await blogsRepositories.findBlogPostById({sortBy, sortDirection, blogId, pageNumber, pageSize})
    // },
    async createPostsByBlogId({title, shortDescription, content, blogId}: {title: string, shortDescription: string, content: string, blogId: ObjectId}) {
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

        return await blogsRepositories.createPostsByBlogId(newPost)
    },
}