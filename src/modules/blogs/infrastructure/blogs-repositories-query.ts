import {blogsCollection, postsCollection} from "../../../db/db";
import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";
import {ObjectId, WithId} from "mongodb";
import {PostDbType} from "../../posts/types/post-db-type";
import {BlogDbType} from "../types/blog-db-type";
import {BlogViewType} from "../types/blog-view-type";
import {PostViewType} from "../../posts/types/post-view-type";

export class BlogsRepositoriesQuery {
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
    }
    async findBlogById(_id: ObjectId) {
        const blog = await blogsCollection.findOne({_id})

        if (blog !== null) {
            return this._getInBlogView(blog);
        }

        return blog
    }
    async findBlogPostById({sortBy, sortDirection, blogId, pageNumber, pageSize}: SortQueryFilterType & {blogId: ObjectId}) {
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
    }
    private _getInPostView(post: WithId<PostDbType>): PostViewType {
        return {
            id: post._id.toString(),
            title: post.title,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            content: post.content,
            shortDescription: post.shortDescription
        };
    }
    private _getInBlogView(blog: WithId<BlogDbType>): BlogViewType {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
            createdAt: blog.createdAt
        };
    }
}
