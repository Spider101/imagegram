import { LOG, HEADERS } from '../../config';
import { Request, Response } from "express";
import { createPost, fetchAllPosts } from '../services';

export async function createPostHandler(req: Request, res: Response) {
    const accountId = req.header(HEADERS.accountId);
    LOG.info(`Creating post for user with accountId: ${accountId}`);

    if (req.file) {
        const createdPost = await createPost({
            caption: req.body.caption,
            // @ts-ignore
            creator: accountId
        }, req.file);

        return res.send(createdPost);
    } else {
        // only reason req.file is falsy is if the file type did not match the filter
        return res.status(422).json({
            message: 'Incorrect file type used! Allowed types include .jpg, .png and .bmp'
        });
    }
}

export async function fetchAllPostsHandler(req: Request, res: Response) {
    LOG.info("Fetching all posts...");

    const pageNum = req.query.page as string;
    const size = req.query.size as string;

    try {
        const {
            totalDocs,
            docs,
            totalPages,
            page
        } = await fetchAllPosts(pageNum, size);

        return res.send({
            totalItems: totalDocs,
            posts: docs,
            totalPages,
            currentPage: page ? page - 1 : parseInt(pageNum)
        });
    } catch(err: any) {
        return res.status(500).send({
            message: err.message || 'Something went wrong while fetching all posts!'
        });
    }
}