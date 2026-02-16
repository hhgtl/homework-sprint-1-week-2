import {ObjectId, WithId} from "mongodb";
import {blogsCollection, commentsCollection, postsCollection} from "../../../db/db";
import {PostDbType} from "../../posts/types/post-db-type";
import {PostViewType} from "../../posts/types/post-view-type";
import {CommentsDbType} from "../types/comments-db-type";
import {CommentsViewType} from "../types/comments-view-type";
import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";

export const commentsRepositoriesQuery = {
    async findCommentById(_id: ObjectId) {
        const comment = await commentsCollection.findOne({_id})

        if (comment !== null) {
            return this._getInView(comment)
        }
        return comment
    },
    async findCommentByPostId({postId, pageSize, pageNumber, sortDirection, sortBy}: SortQueryFilterType & {postId: ObjectId}) {
        const countCommentsPromise = commentsCollection.countDocuments({postId});

        const commentsPromise = commentsCollection
            .find({postId})
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const [totalCount, comments] = await Promise.all([countCommentsPromise, commentsPromise]);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: comments.map(message => this._getInView(message)),
        };
    },
    _getInView(comment: WithId<CommentsDbType>): CommentsViewType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId.toString(),
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
        };
    },
}