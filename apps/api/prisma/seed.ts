import "dotenv/config"
import prisma from "@/src/infra/database/prisma.js"

async function seed() {
    // Add SocketIO app and Web App
    return await prisma.app.createMany({
        data: [
            { id: `${process.env.WEB_APP_ID}`, name: `${process.env.WEB_APP_NAME}`, apiKeyHash: `${process.env.WEB_APP_API_KEY_HASH}` },
            { id: `${process.env.SOCKET_IO_APP_ID}`, name: `${process.env.SOCKET_IO_APP_NAME}`, apiKeyHash: `${process.env.SOCKET_IO_API_KEY_HASH}` },
        ],
        skipDuplicates: true
    })
}

try {
    await seed()
    console.log("Seed has been succesfully executed")
} catch (error) {
    console.error("Error on execute Seed:", error)
    process.exit(1)
} finally {
    await prisma.$disconnect()
}
