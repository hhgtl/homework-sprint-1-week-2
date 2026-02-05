import {GetAllBlogsQuery} from "../domain/blogs-service";
import {blogsCollection, postsCollection} from "../../../db/db";
import {stripMongoDBId} from "../../../common/utils/stripMongoDBId";
import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";
import {WithId} from "mongodb";
import {PostType} from "../../posts/types/post-type";
import {BlogType} from "../types/blog-type";

export const blogsRepositoriesQuery = {
    async getAllBlogs({sortBy, sortDirection, searchNameTerm, pageNumber, pageSize}: SortQueryFilterType & {searchNameTerm: string}) {
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
            items: docs.map(blog => this._getInBlogView(blog)),
        };
    },
    async findBlogById(id: string) {
        const blog = await blogsCollection.findOne({id})

        if (blog !== null) {
            return this._getInBlogView(blog);
        }

        return blog
    },
    async findBlogPostById({sortBy, sortDirection, blogId, pageNumber, pageSize}: SortQueryFilterType & {blogId: string}) {
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
            items: docs.map((blog) => this._getInPostView(blog)),
        };
    },
    _getInPostView(post: WithId<PostType>): PostType {
        return {
            id: post._id.toString(),
            title: post.title,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            content: post.content,
            shortDescription: post.shortDescription
        };
    },
    _getInBlogView(blog: WithId<BlogType>): BlogType {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
            createdAt: blog.createdAt
        };
    },
}