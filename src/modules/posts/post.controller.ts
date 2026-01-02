import { Request, RequestHandler, Response } from "express";
import { postServices } from "./post.service";


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
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
        const result = await postServices.getAllPost(searchString ? { search: searchString, tags } : {});
        res.status(200).json({
            success: true,
            message: "successfully retrieve data",
            data: result
        })
    } catch (error) {
        res.status(401).json({
            message: 'Post creation failed',
            error: error
        })
    }
}

export const postController = {
    createPost,
    getAllPost
}