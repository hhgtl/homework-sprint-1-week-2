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
        debugger
        if (foundedComment && foundedComment.commentatorInfo.userId.toString() === userId.toString()) {


            // return await commentsRepositories.createComment(comment)

        } else {
            return {
                status: HttpStatuses.BadRequest,
                data: null,
                extensions: [],
            };
        }

    }

}