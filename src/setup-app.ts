import express, { Express } from "express";
import {testingRouter} from "./modules/testing/api/testing-routes";
import {blogsRouter} from "./modules/blogs/api/blogs-routes";
import {postsRouter} from "./modules/posts/api/posts-routes";
import {authMiddleware} from "./common/middleware/auth-middleware";

export const setupApp = (app: Express) => {
    app.use(express.json());

    app.use('/testing', testingRouter);
    app.use('/blogs', blogsRouter);
    app.use('/posts', postsRouter);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    return app;
};