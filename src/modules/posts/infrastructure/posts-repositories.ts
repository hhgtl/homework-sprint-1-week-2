import {postsCollection} from "../../../db/db";
import {ObjectId} from "mongodb";

import {PostDbType} from "../types/post-db-type";

export class PostsRepositories {
    async createPosts(newPost: PostDbType) {
        const res = await postsCollection.insertOne(newPost)
        return res.insertedId
    }
    async changePostsById(_id: ObjectId, payload: {title: string, shortDescription: string, content: string, blogId: ObjectId}) {
        const res = await postsCollection.updateOne({_id}, {$set: payload})
        return res.matchedCount === 1
    }
    async removePostsById(_id: ObjectId) {
        const res = await postsCollection.deleteOne({_id})
        return res.deletedCount === 1
    }
}
