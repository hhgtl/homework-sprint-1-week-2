import {postsCollection} from "../../../db/db";
import {stripMongoDBId} from "../../../common/utils/stripMongoDBId";
import {WithId} from "mongodb";

import {PostType} from "../types/post-type";
import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";

export const postsRepositories = {
    async getAllPosts({sortBy, sortDirection, pageNumber, pageSize}: SortQueryFilterType) {
        return await postsCollection.find()
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async createPosts(newPost: PostType) {
        await postsCollection.insertOne(newPost)
        return stripMongoDBId(newPost as WithId<typeof newPost>);
    },
    async findPostsById(id: string) {
        return await postsCollection.findOne({id})
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