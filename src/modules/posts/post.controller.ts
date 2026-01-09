import { Request, RequestHandler, Response } from "express";
import { postServices } from "./post.service";
import { postStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationAndSortHepler";
import { UserRole } from "../../middleware/auth.middleware";

/* Create a single post */
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
};

/* Get all posts */
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

        /* pagination and sorting */
        const { limit, skip, page, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const result = await postServices.getAllPOst({ search: searchString, tags, isFeatured, status, authorId, limit, page, skip, sortBy, sortOrder });
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: 'Post creation failed',
            error: error
        })
    }
};

/* Get single post by Id */
const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('postId is required')
        }
        const result = await postServices.getPostById(id);
        res.status(200).json({
            success: true,
            message: 'post retrieved',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    };
};

/* Get own Post */
const getMyPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error('User not Found')
        }
        const result = await postServices.getMyPost(user.id as string);
        res.status(200).json({
            success: true,
            message: 'post retrieved',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    };
};

/* Update own post */
const updateMyPost: RequestHandler = async (req, res) => {
    try {
        const { postId } = req.params;
        const data = req.body;
        const user = req.user;
        const isAdmin = user?.role === UserRole.ADMIN
        const result = await postServices.UpdateMyPost(postId as string, data, user?.id as string, isAdmin);
        res.status(200).json({
            success: true,
            message: "Data updated successfully",
            data: result
        })
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Update failed";
        res.status(500).json({
            success: false,
            message: errorMessage
        })
    }
}


export const postController = {
    createPost,
    getAllPost,
    getMyPost,
    getPostById,
    updateMyPost
}