import {randomUUID} from 'crypto';
import {blogsCollection, BlogType} from "../db/db";
import {stripMongoDBId} from "../common/utils/stripMongoDBId";
import {WithId} from "mongodb";

export const blogsRepositories = {
    async getAllBlogs() {
        const blogs = await blogsCollection.find().toArray();
        return stripMongoDBId(blogs);
    },
    async createBlog(newBlog: BlogType) {
        await blogsCollection.insertOne(newBlog);

        return stripMongoDBId(newBlog as WithId<typeof newBlog>);
    },
    async findBlogById(id: string) {
        const blog = await blogsCollection.findOne({id})

        if (blog !== null) {
            return stripMongoDBId(blog);
        }

        return blog
    },
    async changeBlogById(id: string, payload: {name: string, description: string, websiteUrl: string}) {
        const res = await blogsCollection.updateOne({id}, {$set: payload})
        return res.matchedCount === 1
    },
    async removeBlogById(id: string) {
        const res = await blogsCollection.deleteOne({id})

        return res.deletedCount === 1
    }
}