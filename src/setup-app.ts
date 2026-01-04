import express, { Express } from "express";
import {testingRouter} from "./routes/testing-routes";
import {blogsRouter} from "./routes/blogs-routes";
import {postsRouter} from "./routes/posts-routes";
import {authMiddleware} from "./middleware/auth-middleware";

export const setupApp = (app: Express) => {
    app.use(express.json());
    app.use('/testing', testingRouter);
    app.use(authMiddleware);


    app.use('/blogs', blogsRouter);
    app.use('/posts', postsRouter);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    return app;
};