import { string } from 'better-auth';
import { Post, postStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";


const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })

    return result;
};


const getAllPOst = async ({
    search,
    tags,
    isFeatured,
    status,
    authorId,
    limit,
    skip,
    sortBy,
    sortOrder
}: {
    search: string | undefined,
    tags: string[] | [],
    isFeatured: boolean | undefined,
    status: postStatus | undefined,
    authorId: string | undefined,
    limit: number,
    skip: number,
    sortBy: string | undefined,
    sortOrder: string | undefined
}) => {
    const andCondition: PostWhereInput[] = []

    if (search) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        has: search
                    }
                }
            ]
        })
    };

    if (tags.length > 0) {
        andCondition.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    };

    if (status) {
        andCondition.push({
            status
        })
    }

    if (typeof isFeatured === 'boolean') {
        andCondition.push({
            isFeatured
        })
    };

    if (authorId) {
        andCondition.push({
            authorId
        })
    }

    const allPost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition
        },
        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder
        } : { createdAt: "desc" }
    })
    return allPost;
}

export const postServices = {
    createPost,
    getAllPOst
}