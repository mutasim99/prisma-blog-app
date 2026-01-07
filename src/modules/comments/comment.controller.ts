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
            error: error
        });
    };
};

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await commentServices.getCommentById(commentId as string);
        res.status(200).json({
            success: true,
            message: "comment retrieved successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params;
        const result = await commentServices.getCommentByAuthorId(authorId as string);
        res.status(200).json({
            success: true,
            message: "comment retrieved by authorId",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "comment fetched failed",
            error: error
        })
    }
};

const deleteComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentServices.deleteComment(commentId as string, user?.id as string);
        res.status(200).json({
            success: true,
            message: "Delete comment successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete comment failed",
            error: error
        })
    }
}

export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment
}