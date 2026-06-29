import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Re-export all generated types so apps import from @rishicodes/db
export * from "./generated/prisma/index.js";
export { PrismaClient } from "./generated/prisma/index.js";

// Singleton to prevent DB connection pool exhaustion during hot-reloads (NestJS dev mode)
function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { db: PrismaClient };

export const db = globalForPrisma.db ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
