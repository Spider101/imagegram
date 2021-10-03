import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { HEADERS } from '../../config/constants';
import { Post } from "../database/models";

export async function requirePostIdHeader(req: Request, res: Response, next: NextFunction) {
    const postId = req.header(HEADERS.postId);
    if (postId && isValidObjectId(postId)) {
        const doesPostExist = await Post.exists({ _id: postId });
        if (doesPostExist) {
            return next();
        } else {
            res.status(404).json({ message: `No Post with ID: ${postId} found to add comment to!` });
        }
    } else {
        res.status(400).json({ message: `Incorrect or missing header for ${HEADERS.postId}` });
    }
}