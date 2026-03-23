import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    rateLimitCollection,
    usersCollection
} from "../../../db/db";


export const testingRepositories = {
    removeAllData: async () => {
        await postsCollection.deleteMany()
        await blogsCollection.deleteMany()
        await usersCollection.deleteMany()
        await commentsCollection.deleteMany()
        await rateLimitCollection.deleteMany()
    }
}