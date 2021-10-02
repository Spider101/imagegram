import express from "express";
import { createAccountHandler } from "../controllers";

const accountRouter = express.Router();

accountRouter.post('/', createAccountHandler);

export default accountRouter;