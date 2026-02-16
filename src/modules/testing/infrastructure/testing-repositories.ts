import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../../../db/db";

export const testingRepositories = {
    removeAllVideo: async () => {
        await postsCollection.deleteMany()
        await blogsCollection.deleteMany()
        await usersCollection.deleteMany()
        await commentsCollection.deleteMany()
    }
}