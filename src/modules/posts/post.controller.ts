import { Request, Response } from "express";
import { postServices } from "./post.service";


const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postServices.createPost(req.body);
        res.status(201).json(result)
    } catch (error) {
        res.status(401).json({
            message:'Post creation failed',
            error: error
        })
    }
}

export const postController = {
    createPost
}