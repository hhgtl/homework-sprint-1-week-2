import {blogsCollection, BlogType, postsCollection, PostType} from "../../../db/db";
import {stripMongoDBId} from "../../../common/utils/stripMongoDBId";
import {WithId} from "mongodb";
import {GetAllBlogsQuery} from "../domain/blogs-service";

export const blogsRepositories = {
    async getAllBlogs({sortBy, sortDirection, searchNameTerm, pageNumber, pageSize}: GetAllBlogsQuery) {
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        const countPromise = blogsCollection.countDocuments(filter);

        const docsPromise = blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const [totalCount, docs] = await Promise.all([countPromise, docsPromise]);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: stripMongoDBId(docs),
        };
    },
    async createBlog(newBlog: BlogType) {
        await blogsCollection.insertOne(newBlog);

        return stripMongoDBId(newBlog as WithId<typeof newBlog>);
    },
    async findBlogById(id: string) {
        const blog = await blogsCollection.findOne({id})

        if (blog !== null) {
            return stripMongoDBId(blog);
        }

        return blog
    },
    async changeBlogById(id: string, payload: {name: string, description: string, websiteUrl: string}) {
        const res = await blogsCollection.updateOne({id}, {$set: payload})
        return res.matchedCount === 1
    },
    async removeBlogById(id: string) {
        const res = await blogsCollection.deleteOne({id})

        return res.deletedCount === 1
    },
    async findBlogPostById({sortBy, sortDirection, blogId, pageNumber, pageSize}: Omit<GetAllBlogsQuery, 'searchNameTerm'> & {blogId: string}) {
        const countPromise = postsCollection.countDocuments({blogId});

        const docsPromise = postsCollection
            .find({blogId})
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const [totalCount, docs] = await Promise.all([countPromise, docsPromise]);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: stripMongoDBId(docs),
        };
    },
    async createPostsByBlogId(newPost: PostType) {
        const blog = await blogsCollection.findOne({id: newPost.blogId})

        if (blog) {
            await postsCollection.insertOne(newPost)
            return stripMongoDBId(newPost as WithId<typeof newPost>);
        }

        return blog
    },
}