import {PostDbType} from "../../posts/types/post-db-type";
import {commentsCollection} from "../../../db/db";
import {CommentsDbType} from "../types/comments-db-type";

export const commentsRepositories = {
    async createComment(comment: CommentsDbType) {
        const res = await commentsCollection.insertOne(comment)
        return res.insertedId
    },
}