import {commentsRepositories} from "../infrastructure/comments-repositories";
import {ObjectId} from "mongodb";
import {HttpStatuses} from "../../../common/types/http-statuses";

export const commentsService = {
    async createNewComment({content, postId, userId, userLogin}: {postId: ObjectId, content: string, userId: ObjectId, userLogin: string}) {
        const comment = {
            content,
            commentatorInfo: {
                userId,
                userLogin
            },
            createdAt: new Date().toISOString(),
            postId
        }

        return await commentsRepositories.createComment(comment)
    },
    async changeCommentById({content, commentId, userId}: {commentId: ObjectId, content: string, userId: ObjectId}) {
        const foundedComment = await commentsRepositories.findCommentById(commentId)

        if (!foundedComment) {
            return {
                status: HttpStatuses.NotFound,
                data: null,
                extensions: [],
            };
        }

        if (foundedComment && foundedComment.commentatorInfo.userId.toString() === userId.toString()) {
            await commentsRepositories.updateComment({content, _id: commentId})

            return {
                status: HttpStatuses.Success,
                data: null,
                extensions: [],
            };

        } else {
            return {
                status: HttpStatuses.Forbidden,
                data: null,
                extensions: [],
            };
        }

    },
    async deleteComment({commentId, userId}: {commentId: ObjectId, userId: ObjectId}) {
        const foundedComment = await commentsRepositories.findCommentById(commentId)

        if (!foundedComment) {
            return {
                status: HttpStatuses.NotFound,
                data: null,
                extensions: [],
            };
        }

        if (foundedComment.commentatorInfo.userId.toString() === userId.toString()) {
            await commentsRepositories.deleteCommentById(commentId)

            return {
                status: HttpStatuses.Success,
                data: null,
                extensions: [],
            };
        } else {
            return {
                status: HttpStatuses.Forbidden,
                data: null,
                extensions: [],
            };
        }

    }

}