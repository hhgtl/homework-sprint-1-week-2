import {BlogDbType} from "../../blogs/types/blog-db-type";
import {blogsCollection, postsCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {PostDbType} from "../../posts/types/post-db-type";

export const authRepositories = {
    // async createBlog(newBlog: BlogDbType) {
    //     const blogId = await blogsCollection.insertOne(newBlog);
    //     return blogId.insertedId;
    // },
    // async findBlogById(id: ObjectId) {
    //     return await blogsCollection.findOne({_id: id})
    // },
    // async changeBlogById(_id: ObjectId, payload: {name: string, description: string, websiteUrl: string}) {
    //     const res = await blogsCollection.updateOne({_id}, {$set: payload})
    //     return res.matchedCount === 1
    // },
    // async removeBlogById(_id: ObjectId) {
    //     const res = await blogsCollection.deleteOne({_id})
    //
    //     return res.deletedCount === 1
    // },
    // async createPostsByBlogId(newPost: PostDbType) {
    //     const blog = await blogsCollection.findOne({_id: newPost.blogId})
    //
    //     if (blog) {
    //         const res = await postsCollection.insertOne(newPost)
    //         return res.insertedId
    //     }
    //
    //     return blog
    // },
}