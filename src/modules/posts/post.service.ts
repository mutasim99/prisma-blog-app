import { commentStatus } from './../../../generated/prisma/enums';
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
    page,
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
    page: number,
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
        include: {
            _count: {
                select: { Comment: true }
            }
        },
        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder
        } : { createdAt: "desc" }
    })

    const total = await prisma.post.count({
        where: {
            AND: andCondition
        }
    })

    return {
        data: allPost,
        totalData: total,
        limit: limit,
        currentPage: page,
        totalPage: Math.ceil(total / limit)
    };
}

const getPostById = async (postId: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                Comment: {
                    where: {
                        parent: null
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        replies: {
                            where: {
                                status: commentStatus.APPROVED
                            },
                            include: {

                                replies: {
                                    where: {
                                        status: commentStatus.APPROVED
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: { Comment: true }
                }
            },

        })
        return postData
    });
};



export const postServices = {
    createPost,
    getAllPOst,
    getPostById
}