import {blogsCollection, postsCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
// import {GetAllBlogsQuery} from "../domain/blogs-service";
import {BlogDbType} from "../types/blog-db-type";
import {PostDbType} from "../../posts/types/post-db-type";

export const blogsRepositories = {
    // async getAllBlogs({sortBy, sortDirection, searchNameTerm, pageNumber, pageSize}: SortQueryFilterType & {searchNameTerm: string}) {
    //     const filter: any = {};
    //
    //     if (searchNameTerm) {
    //         filter.name = { $regex: searchNameTerm, $options: 'i' };
    //     }
    //
    //     return await blogsCollection
    //         .find(filter)
    //         .sort({[sortBy]: sortDirection})
    //         .skip((pageNumber - 1) * pageSize)
    //         .limit(pageSize)
    //         .toArray()
    // },
    async createBlog(newBlog: BlogDbType) {
        const blogId = await blogsCollection.insertOne(newBlog);
        return blogId.insertedId;
    },
    async findBlogById(id: ObjectId) {
        return await blogsCollection.findOne({_id: id})
    },
    async changeBlogById(_id: ObjectId, payload: {name: string, description: string, websiteUrl: string}) {
        const res = await blogsCollection.updateOne({_id}, {$set: payload})
        return res.matchedCount === 1
    },
    async removeBlogById(_id: ObjectId) {
        const res = await blogsCollection.deleteOne({_id})

        return res.deletedCount === 1
    },
    // async findBlogPostById({sortBy, sortDirection, blogId, pageNumber, pageSize}: SortQueryFilterType & {blogId: string}) {
    //     const countPromise = postsCollection.countDocuments({blogId});
    //
    //     const docsPromise = postsCollection
    //         .find({blogId})
    //         .sort({ [sortBy]: sortDirection })
    //         .skip((pageNumber - 1) * pageSize)
    //         .limit(pageSize)
    //         .toArray();
    //
    //     const [totalCount, docs] = await Promise.all([countPromise, docsPromise]);
    //
    //     return {
    //         pagesCount: Math.ceil(totalCount / pageSize),
    //         page: pageNumber,
    //         pageSize: pageSize,
    //         totalCount: totalCount,
    //         items: stripMongoDBId(docs),
    //     };
    // },
    async createPostsByBlogId(newPost: PostDbType) {
        const blog = await blogsCollection.findOne({_id: newPost.blogId})

        if (blog) {
            const res = await postsCollection.insertOne(newPost)
            return res.insertedId
        }

        return blog
    },
}