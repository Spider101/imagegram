import express, { Express } from "express";
import accountRouter from "./account.routes";
import postRouter from "./post.routes";

export function setupRoutes(app: Express) {
    app.use('/account', accountRouter);
    app.use('/post', postRouter);
}