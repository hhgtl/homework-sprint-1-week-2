import {
    authCollection,
    blogsCollection,
    commentsCollection,
    postsCollection,
    rateLimitCollection,
    usersCollection
} from "../../../db/db";


export class TestingRepositories {
    async removeAllData() {
        await postsCollection.deleteMany()
        await blogsCollection.deleteMany()
        await usersCollection.deleteMany()
        await commentsCollection.deleteMany()
        await rateLimitCollection.deleteMany()
        await authCollection.deleteMany()
    }
}
