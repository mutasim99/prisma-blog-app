import { prisma } from "../../lib/prisma"

const createComment = async (Payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?: string
}) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: Payload.postId
        }
    });

    if (Payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: Payload.parentId
            }
        })
    };

    const result = await prisma.comment.create({
        data: Payload
    });

    return result;

};

const getCommentById = async (id: string) => {
    const result = await prisma.comment.findUnique({
        where: {
            id
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    return result
};

const getCommentByAuthorId = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
};

const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        }
    });

    if (!commentData) {
        throw new Error('Comment data is not found');
    };

    return await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })
}

export const commentServices = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment
}