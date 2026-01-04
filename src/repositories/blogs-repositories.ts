import {randomUUID} from 'crypto';
import {blogsDB} from "../db/blogs-db";

export const blogsRepositories = {
    getAllBlogs() {
        return blogsDB
    },
    createBlog({name, description, websiteUrl}: {name: string, description: string, websiteUrl: string}) {
        const newBlog = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
        }
        blogsDB.push(newBlog)
        return newBlog
    },
    findBlogById(id: string) {
        const index = blogsDB.findIndex(b => b.id === id);

        if (index === -1) {
            return false
        } else {
            return blogsDB[index]
        }
    },
    changeBlogById(id: string, body: {name: string, description: string, websiteUrl: string}) {
        const index = blogsDB.findIndex(b => b.id === id);

        if (index === -1) {
            return false
        } else {
            return blogsDB[index] = {
                ...blogsDB[index],
                websiteUrl: body.websiteUrl,
                name: body.name,
                description: body.description,

            }
        }
    },
    removeBlogById(id: string) {
        const index = blogsDB.findIndex(b => b.id === id);
        if (index === -1) {
            return false
        } else {
            blogsDB.splice(index, 1)
            return true
        }
    }
}