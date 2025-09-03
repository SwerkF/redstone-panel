import { PrismaClient } from '#generated/client'

declare global {
	var __prisma: PrismaClient | undefined
}

const prisma = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
	globalThis.__prisma = prisma
}

export default prisma
