import {randomUUID} from 'crypto';
import {blogsCollection} from "../db/db";
import {stripMongoDBId} from "../common/utils/stripMongoDBId";

export const blogsRepositories = {
    async getAllBlogs() {
        const blogs = await blogsCollection.find().toArray();
        return stripMongoDBId(blogs);
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
        await blogsCollection.insertOne(newBlog);
        return newBlog
    },
    async findBlogById(id: string) {
        const blog = await blogsCollection.findOne({id})

        if (blog !== null) {
            return stripMongoDBId(blog);
        }

        return blog
    },
    async changeBlogById(id: string, body: {name: string, description: string, websiteUrl: string}) {
        const res = await blogsCollection.updateOne({id}, {$set: {
                websiteUrl: body.websiteUrl,
                name: body.name,
                description: body.description,
            }})
        return res.matchedCount === 1
    },
    async removeBlogById(id: string) {
        const res = await blogsCollection.deleteOne({id})

        return res.deletedCount === 1
    }
}