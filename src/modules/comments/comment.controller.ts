import { Request, Response } from "express";
import { commentServices } from "./comment.service";


const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user
        req.body.authorId = user?.id
        const result = await commentServices.createComment(req.body);
        res.status(200).json({
            success: true,
            message: 'comment created successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:error
        });
    };
};

export const commentController = {
    createComment
}