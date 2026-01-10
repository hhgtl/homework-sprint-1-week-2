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
    isMembership: boolean,
    createdAt: string,
}


const mongoUri = "mongodb+srv://petrosahal66:nRjwaifSkxPl83xm@cluster0.o6rzywd.mongodb.net/?appName=Cluster0"

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
