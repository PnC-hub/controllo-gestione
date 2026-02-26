import { PrismaClient } from '@prisma/client'

// Lazy-initialized Prisma Client (pattern Kontabila)
declare global {
  var __prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (!globalThis.__prisma) {
    const dbUrl = process.env.DATABASE_URL
    globalThis.__prisma = new PrismaClient({
      datasources: dbUrl ? { db: { url: dbUrl } } : undefined
    })
  }
  return globalThis.__prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = client[prop as keyof PrismaClient]
    return typeof value === 'function' ? value.bind(client) : value
  }
})
