import {MongoClient} from 'mongodb'

export type BlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    isMembership: boolean,
    createdAt: string,
}

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
//local
const mongoUri = process.env.mongoURI || "mongodb://localhost:27017";

// mongo atlas

// const mongoUri = "mongodb+srv://petrosahal66:fMNc55JdIgAzx81t@cluster0.o6rzywd.mongodb.net/?appName=Cluster0&family=4"


export const client = new MongoClient(mongoUri);

export const db = client.db("blogger-platform")
export const blogsCollection = db.collection<BlogType>("blogs");
export const postsCollection = db.collection<PostType>("posts");

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
