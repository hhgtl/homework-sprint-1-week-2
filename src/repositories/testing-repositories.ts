import {blogsDB} from '../db/blogs-db'
import {postsDB} from '../db/posts-db'

export const testingRepositories = {
    removeAllVideo: () => {
        blogsDB.splice(0, blogsDB.length);
        postsDB.splice(0, postsDB.length);
    }
}