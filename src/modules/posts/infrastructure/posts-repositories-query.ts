import {postsCollection} from "../../../db/db";
import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";
import {PostDbType} from "../types/post-db-type";
import {ObjectId, WithId} from "mongodb";
import {BlogViewType} from "../../blogs/types/blog-view-type";
import {PostViewType} from "../types/post-view-type";

export const postsRepositoriesQuery = {
    async getAllPosts({sortBy, sortDirection, pageNumber, pageSize}: SortQueryFilterType) {
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
            items: posts.map((post) => this._getInView(post)),
        };
    },
    async findPostsById(_id: ObjectId) {
        const post = await postsCollection.findOne({_id})

        if (post !== null) {
            return this._getInView(post)
        }
        return post
    },
    _getInView(post: WithId<PostDbType>): PostViewType {
        return {
            id: post._id.toString(),
            title: post.title,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            content: post.content,
            shortDescription: post.shortDescription
        };
    },
}