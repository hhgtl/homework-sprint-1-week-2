import {PostsRepositories} from "../infrastructure/posts-repositories";
import {BlogsRepositories} from "../../blogs/infrastructure/blogs-repositories";
import {ObjectId} from "mongodb";

export class PostsService {
    private postsRepositories = new PostsRepositories()
    private blogsRepositories = new BlogsRepositories()

    async createPosts({title, shortDescription, content, blogId}: {title: string, shortDescription: string, content: string, blogId: ObjectId}) {
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

        return await this.postsRepositories.createPosts(newPost)
    }
    async changePostsById(_id: ObjectId, body: {title: string, shortDescription: string, content: string, blogId: ObjectId}) {
        const payload = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
        }

        return await this.postsRepositories.changePostsById(_id, payload)
    }
    async removePostsById(_id: ObjectId) {
        return this.postsRepositories.removePostsById(_id)
    }
}
