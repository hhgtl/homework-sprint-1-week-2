import {randomUUID} from "crypto";
import {Post, postsDB} from "../db/posts-db";
import {blogsDB} from "../db/blogs-db";

export const postsRepositories = {
    getAllPosts() {
        return postsDB
    },
    createPosts({title, shortDescription, content, blogId}: {title: string, shortDescription: string, content: string, blogId: string}) {
        const blogIndex = blogsDB.findIndex(b => b.id === blogId);
        const blogName = blogsDB[blogIndex].name

        const newPosts: Post = {
            id: randomUUID(),
            title,
            shortDescription,
            content,
            blogId,
            blogName
        }
        postsDB.push(newPosts)
        return newPosts
    },
    findPostsById(id: string) {
        const index = postsDB.findIndex(b => b.id === id);

        if (index === -1) {
            return false
        } else {
            return postsDB[index]
        }
    },
    changePostsById(id: string, body: {title: string, shortDescription: string, content: string, blogId: string}) {
        const index = postsDB.findIndex(b => b.id === id);

        if (index === -1) {
            return false
        } else {
            return postsDB[index] = {
                ...postsDB[index],
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,

            }
        }
    },
    removePostsById(id: string) {
        const index = postsDB.findIndex(b => b.id === id);
        if (index === -1) {
            return false
        } else {
            postsDB.splice(index, 1)
            return true
        }
    }
}