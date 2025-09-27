import { PrismaClient } from '#generated/client'

declare global {
    var PRISMA: PrismaClient | undefined
}

const prisma = globalThis.PRISMA || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalThis.PRISMA = prisma
}

export default prisma
