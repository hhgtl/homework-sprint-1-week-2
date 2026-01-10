import {randomUUID} from "crypto";
import {blogsCollection, postsCollection} from "../db/db";
import {stripMongoDBId} from "../common/utils/stripMongoDBId";

export const postsRepositories = {
    async getAllPosts() {
        const posts =  await postsCollection.find().toArray();

        return stripMongoDBId(posts);

        // return posts.map((post) => {
        //     const {_id, ...rest} = post;
        //     return {...rest}
        // });
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
            createdAt: new Date().toISOString(),
        }
        await postsCollection.insertOne(newPost)
        return newPost
    },
    async findPostsById(id: string) {
        const post = await postsCollection.findOne({id})
        if (post !== null) {
            return stripMongoDBId(post)
        }
        return post
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