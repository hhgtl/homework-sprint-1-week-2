import {postsCollection} from "../../../db/db";
import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";
import {PostType} from "../types/post-type";
import {WithId} from "mongodb";

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
    async findPostsById(id: string) {
        const post = await postsCollection.findOne({id})
        if (post !== null) {
            return this._getInView(post)
        }
        return post
    },
    _getInView(post: WithId<PostType>): PostType {
        return {
            id: post._id.toString(),
            title: post.title,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            content: post.content,
            shortDescription: post.shortDescription
        };
    },
}