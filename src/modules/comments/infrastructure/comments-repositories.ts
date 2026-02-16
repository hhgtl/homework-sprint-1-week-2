import {commentsCollection} from "../../../db/db";
import {CommentsDbType} from "../types/comments-db-type";
import {ObjectId} from "mongodb";

export const commentsRepositories = {
    async createComment(comment: CommentsDbType) {
        const res = await commentsCollection.insertOne(comment)
        return res.insertedId
    },
    async findCommentById(commentId: ObjectId) {
        return await commentsCollection.findOne({_id: commentId})
    },
    async updateComment({content, _id}: {_id: ObjectId, content: string}) {
        const res = await commentsCollection.updateOne({_id}, {$set: {content}});
        return res.matchedCount === 1
    },
    async deleteCommentById(_id: ObjectId) {
        const res = await commentsCollection.deleteOne({_id});
        return res.deletedCount === 1
    }

}