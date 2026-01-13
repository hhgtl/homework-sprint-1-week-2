import {postsCollection, PostType} from "../db/db";
import {stripMongoDBId} from "../common/utils/stripMongoDBId";
import {WithId} from "mongodb";
import {GetAllPostsQuery} from "../services/posts-service";



export const postsRepositories = {
    async getAllPosts({sortBy, sortDirection}: GetAllPostsQuery) {
        const posts =  await postsCollection.find()
            .sort({ [sortBy]: sortDirection })
            .toArray();

        return stripMongoDBId(posts);
    },
    async createPosts(newPost: PostType) {
        await postsCollection.insertOne(newPost)
        return stripMongoDBId(newPost as WithId<typeof newPost>);
    },
    async findPostsById(id: string) {
        const post = await postsCollection.findOne({id})
        if (post !== null) {
            return stripMongoDBId(post)
        }
        return post
    },
    async changePostsById(id: string, payload: {title: string, shortDescription: string, content: string, blogId: string}) {
        const res = await postsCollection.updateOne({id}, {$set: payload})
        return res.matchedCount === 1
    },
    async removePostsById(id: string) {
        const res = await postsCollection.deleteOne({id})
        return res.deletedCount === 1
    }
}