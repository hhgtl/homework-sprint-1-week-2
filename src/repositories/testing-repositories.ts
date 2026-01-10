import {blogsCollection, postsCollection} from "../db/db";

export const testingRepositories = {
    removeAllVideo: async () => {
        await postsCollection.deleteMany()
        await blogsCollection.deleteMany()
    }
}