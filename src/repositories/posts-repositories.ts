import {randomUUID} from "crypto";
import {blogsCollection, postsCollection} from "../db/db";

export const postsRepositories = {
    async getAllPosts() {
        return await postsCollection.find().toArray();
    },
    async createPosts({title, shortDescription, content, blogId}: {title: string, shortDescription: string, content: string, blogId: string}) {
        const blog = await blogsCollection.findOne({id: blogId})
        const blogName = blog ? blog.name : ''

        const newPost = {
            id: randomUUID(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            isMembership: false,
            createdAt: new Date().toISOString(),
        }
        await postsCollection.insertOne(newPost)
        return newPost
    },
    async findPostsById(id: string) {
        return await postsCollection.findOne({id})
    },
    async changePostsById(id: string, body: {title: string, shortDescription: string, content: string, blogId: string}) {
        const res = await postsCollection.updateOne({id}, {$set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
            }})
        return res.matchedCount === 1
    },
    async removePostsById(id: string) {
        const res = await postsCollection.deleteOne({id})
        return res.deletedCount === 1
    }
}