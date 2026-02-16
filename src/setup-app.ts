import express, { Express } from "express";
import {testingRouter} from "./modules/testing/api/testing-routes";
import {blogsRouter} from "./modules/blogs/api/blogs-routes";
import {postsRouter} from "./modules/posts/api/posts-routes";
import {authMiddleware} from "./common/middleware/auth-middleware";
import {usersRouter} from "./modules/users/api/users-routes";
import {authRouter} from "./modules/auth/api/auth-routes";
import {commentsRoutes} from "./modules/comments/api/comments-routes";

export const setupApp = (app: Express) => {
    app.use(express.json());

    app.use('/testing', testingRouter);
    app.use('/blogs', blogsRouter);
    app.use('/posts', postsRouter);
    app.use('/users', usersRouter);
    app.use('/auth', authRouter);
    app.use('/comments', commentsRoutes);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    return app;
};