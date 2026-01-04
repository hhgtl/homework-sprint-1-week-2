export type BlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export const blogsDB: BlogType[] = [
    {
        id: "testId",
        name: "testName",
        description: "testDescription",
        websiteUrl: "testWebsiteUrl",
    }
]