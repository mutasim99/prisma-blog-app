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

}

export const commentServices = {
    createComment,
}