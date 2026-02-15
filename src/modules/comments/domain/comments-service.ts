import {commentsRepositories} from "../infrastructure/comments-repositories";

export const commentsService = {
    async createNewComment({content, userId, userLogin}: {content: string, userId: string, userLogin: string}) {
        const comment = {
            content,
            commentatorInfo: {
                userId,
                userLogin
            },
            createdAt: new Date().toISOString(),
        }

        return await commentsRepositories.createComment(comment)
    }

}