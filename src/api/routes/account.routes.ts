import express from "express";
import { createAccountHandler, deleteAccountHandler } from "../controllers";

const accountRouter = express.Router();

accountRouter.post('/', createAccountHandler);
accountRouter.delete('/:accountId', deleteAccountHandler)

export default accountRouter;