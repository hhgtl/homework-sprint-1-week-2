import {MongoClient} from 'mongodb'
import {BlogDbType} from "../modules/blogs/types/blog-db-type";
import {PostDbType} from "../modules/posts/types/post-db-type";
import {UsersDbType} from "../modules/users/types/users-db-type";
import {CommentsDbType} from "../modules/comments/types/comments-db-type";
import {AuthDbType} from "../modules/auth/types/auth-db-type";

//local
const mongoUri = process.env.mongoURI || "mongodb://localhost:27017";

// mongo atlas

// const mongoUri = "mongodb+srv://petrosahal66:fMNc55JdIgAzx81t@cluster0.o6rzywd.mongodb.net/?appName=Cluster0&family=4"


export const client = new MongoClient(mongoUri);

export const db = client.db("blogger-platform")
export const blogsCollection = db.collection<BlogDbType>("blogs");
export const postsCollection = db.collection<PostDbType>("posts");
export const usersCollection = db.collection<UsersDbType>("users");
export const authCollection = db.collection<AuthDbType>("auth");
export const commentsCollection = db.collection<CommentsDbType>("comments");

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("blogger-platform").command({ ping: 1 });
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
