import {blogsCollection, postsCollection} from "../../../db/db";
import {stripMongoDBId} from "../../../common/utils/stripMongoDBId";
import {WithId} from "mongodb";
import {GetAllPostsQuery} from "../domain/posts-service";
import {PostType} from "../types/post-type";

export const postsRepositories = {
    async getAllPosts({sortBy, sortDirection, pageNumber, pageSize}: GetAllPostsQuery) {
        const countPromise = postsCollection.countDocuments();

        const postsPromise =  postsCollection.find()
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const [totalCount, posts] = await Promise.all([countPromise, postsPromise]);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: stripMongoDBId(posts),
        };
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