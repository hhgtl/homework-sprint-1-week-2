import {ObjectId, WithId} from "mongodb";
import {commentsCollection, postsCollection} from "../../../db/db";
import {PostDbType} from "../../posts/types/post-db-type";
import {PostViewType} from "../../posts/types/post-view-type";
import {CommentsDbType} from "../types/comments-db-type";
import {CommentsViewType} from "../types/comments-view-type";

export const commentsRepositoriesQuery = {
    async findCommentById(_id: ObjectId) {
        const comment = await commentsCollection.findOne({_id})

        if (comment !== null) {
            return this._getInView(comment)
        }
        return comment
    },
    _getInView(comment: WithId<CommentsDbType>): CommentsViewType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
        };
    },
}