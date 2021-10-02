import express, { Express } from "express";
import accountRouter from "./account.routes";

export function setupRoutes(app: Express) {
    app.use('/account', accountRouter);
}