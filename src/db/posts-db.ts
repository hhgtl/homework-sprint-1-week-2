export type Post = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
}

export const postsDB: Post[] = [
    {
        id: "testPostsId",
        title: "testTitle",
        shortDescription: "testShortDescription",
        content: "testContent",
        blogId: "testBlogId",
        blogName: "testBlogName",
    }
]