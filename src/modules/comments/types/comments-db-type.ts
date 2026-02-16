import {ObjectId} from "mongodb";

export type CommentsDbType = {
    "content": string,
    "commentatorInfo": {
        "userId": ObjectId,
        "userLogin": string
    },
    "createdAt": string
    postId: ObjectId
}