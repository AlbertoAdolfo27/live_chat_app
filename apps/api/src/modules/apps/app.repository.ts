import prisma from "../../infra/database/prisma.js";

export async function getAppByApiKeyHash(apiKeyHash: string) {
    return prisma.app.findUnique({
        where: { apiKeyHash },
        select: {
            id: true,
            name: true,
            isActive: true
        }
    })
}