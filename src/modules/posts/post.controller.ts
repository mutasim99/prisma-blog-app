import { Request, RequestHandler, Response } from "express";
import { postServices } from "./post.service";
import { postStatus } from "../../../generated/prisma/enums";


const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "please login first to create post"
            })
        };

        const result = await postServices.createPost(req.body, user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(401).json({
            message: 'Post creation failed',
            error: error
        })
    }
}

const getAllPost: RequestHandler = async (req, res) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === 'string' ? search : undefined;

        /* search with tags */
        const tags = req.query.tags ? (req.query.tags as string).split(",") : []

        /* search with isFeatured (true | false) */
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined;

        /*  search with status*/
        const status = req.query.status as postStatus | undefined

        /* search with authorId */
        const authorId = req.query.authorId as string | undefined

        const result = await postServices.getAllPOst({ search: searchString, tags, isFeatured, status, authorId });
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: 'Post creation failed',
            error: error
        })
    }
}

export const postController = {
    createPost,
    getAllPost
}