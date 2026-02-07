import {postsCollection} from "../../../db/db";
import {stripMongoDBId} from "../../../common/utils/stripMongoDBId";
import {ObjectId, WithId} from "mongodb";

import {PostDbType} from "../types/post-db-type";
import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";

export const postsRepositories = {
    // async getAllPosts({sortBy, sortDirection, pageNumber, pageSize}: SortQueryFilterType) {
    //     return await postsCollection.find()
    //         .sort({[sortBy]: sortDirection})
    //         .skip((pageNumber - 1) * pageSize)
    //         .limit(pageSize)
    //         .toArray();
    // },
    async createPosts(newPost: PostDbType) {
        await postsCollection.insertOne(newPost)
        return stripMongoDBId(newPost as WithId<typeof newPost>);
    },
    // async findPostsById(id: string) {
    //     return await postsCollection.findOne({id})
    // },
    async changePostsById(_id: ObjectId, payload: {title: string, shortDescription: string, content: string, blogId: ObjectId}) {
        const res = await postsCollection.updateOne({_id}, {$set: payload})
        return res.matchedCount === 1
    },
    async removePostsById(_id: ObjectId) {
        const res = await postsCollection.deleteOne({_id})
        return res.deletedCount === 1
    }
}