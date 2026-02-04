import {randomUUID} from "crypto";
import {blogsRepositories} from "../infrastructure/blogs-repositories";
import {SortDirection} from "../api/blogs-routes";
import {postsRepositories} from "../../posts/infrastructure/posts-repositories";

export type GetAllBlogsQuery = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: SortDirection,
    pageSize: number
    pageNumber: number
}

export const blogsService = {
    async getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize}: GetAllBlogsQuery) {
        return await blogsRepositories.getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize})
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
    },
    async findBlogPostById({sortBy, sortDirection, blogId, pageNumber, pageSize}: Omit<GetAllBlogsQuery, 'searchNameTerm'> & {blogId: string}) {
        return await blogsRepositories.findBlogPostById({sortBy, sortDirection, blogId, pageNumber, pageSize})
    },
    async createPostsByBlogId({title, shortDescription, content, blogId}: {title: string, shortDescription: string, content: string, blogId: string}) {
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

        return await blogsRepositories.createPostsByBlogId(newPost)
    },
}