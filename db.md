# Prisma 7 + Supabase + NestJS + Next.js — pnpm Monorepo

Full setup guide for a three-app monorepo (`api`, `admin`, `public`) using Prisma 7, Supabase PostgreSQL, and Render as host.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Root Config](#2-root-config)
3. [packages/db — Shared Database Package](#3-packagesdb--shared-database-package)
4. [apps/api — NestJS](#4-appsapi--nestjs)
5. [apps/admin and apps/public — Next.js](#5-appsadmin-and-appspublic--nextjs)
6. [Environment Variables](#6-environment-variables)
7. [Supabase Connection Strings](#7-supabase-connection-strings)
8. [Daily Workflow](#8-daily-workflow)
9. [Render Deployment](#9-render-deployment)
10. [How It All Fits Together](#10-how-it-all-fits-together)

---

## 1. Project Structure

```
monorepo/
├── .npmrc
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── apps/
│   ├── api/                        (NestJS — api.rishicodes.com)
│   │   └── src/
│   │       └── prisma/
│   │           ├── prisma.module.ts
│   │           └── prisma.service.ts
│   ├── admin/                      (Next.js — admin.rishicodes.com)
│   │   └── src/
│   └── public/                     (Next.js — rishicodes.com)
│       └── src/
└── packages/
    └── db/                         (shared Prisma package)
        ├── package.json
        ├── prisma.config.ts
        ├── prisma/
        │   ├── schema.prisma
        │   └── migrations/
        └── src/
            ├── generated/          ← never touch manually, git-ignored
            │   └── prisma/
            └── index.ts
```

---

## 2. Root Config

### `.npmrc`

Required for pnpm to hoist Prisma binaries correctly across workspace boundaries.
Without this, CLI commands like `prisma migrate` fail to find the engine.

```ini
hoist-pattern[]=*prisma*
hoist-pattern[]=*@prisma*
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `package.json`

```json
{
  "name": "rishicodes-monorepo",
  "private": true,
  "scripts": {
    "db:generate":        "pnpm --filter @rishicodes/db prisma generate",
    "db:migrate:dev":     "pnpm --filter @rishicodes/db prisma migrate dev",
    "db:migrate:deploy":  "pnpm --filter @rishicodes/db prisma migrate deploy",
    "db:push":            "pnpm --filter @rishicodes/db prisma db push",
    "db:studio":          "pnpm --filter @rishicodes/db prisma studio",
    "db:seed":            "pnpm --filter @rishicodes/db prisma db seed"
  }
}
```

### `.gitignore`

```
# Prisma generated client — rebuilt on install
packages/db/src/generated/

# Environment files
.env
.env.local
.env.production
```

---

## 3. packages/db — Shared Database Package

This package owns everything Prisma-related. All three apps import from here.

### `packages/db/package.json`

```json
{
  "name": "@rishicodes/db",
  "version": "0.0.1",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "postinstall": "prisma generate --config prisma.config.ts"
  },
  "dependencies": {
    "@prisma/adapter-pg": "latest",
    "@prisma/client": "latest",
    "pg": "latest"
  },
  "devDependencies": {
    "@types/pg": "latest",
    "dotenv": "latest",
    "prisma": "latest"
  },
  "sideEffects": false
}
```

**Why each package:**

| Package | Role |
|---|---|
| `@prisma/client` | Generated client base |
| `@prisma/adapter-pg` | Connects Prisma to PostgreSQL via `pg` driver |
| `pg` | PostgreSQL driver — peer dep of adapter, must be explicit |
| `@types/pg` | TypeScript types for `pg` |
| `dotenv` | Loads `.env` for Prisma CLI commands via `prisma.config.ts` |
| `prisma` | CLI — only needed here, not in apps |

### `packages/db/prisma/schema.prisma`

In Prisma 7, the datasource block has no `url` or `directUrl` — those moved to `prisma.config.ts`.
The generator output must be specified explicitly since `src/generated` is required for the `prisma-client` provider.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// Add your models below

model Post {
  id          String   @id @default(cuid())
  title       String
  contentJson Json?
  contentHtml String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### `packages/db/prisma.config.ts`

This file is used **only by the Prisma CLI** — for migrations, introspection, and studio.
Point `datasource.url` to `DIRECT_URL` (not the pooler) because migrations require a direct connection.

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
```

### `packages/db/src/index.ts`

Exports two things:

- **All generated types** — so apps get `Post`, `Prisma`, etc. from `@rishicodes/db`
- **`db` singleton** — for Next.js apps (admin + public), safe across HMR in dev

```ts
import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// Re-export all generated types so apps import from @rishicodes/db, not from generated path
export * from "./generated/prisma";
export { PrismaClient } from "./generated/prisma";

// Singleton for Next.js apps
// globalThis ref prevents multiple PrismaClient instances during HMR in dev
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
```

---

## 4. apps/api — NestJS

The API gets its **own** `PrismaService` with its own adapter instance and connection pool.
It does not use the `db` singleton from `packages/db` — that singleton is for Next.js only.

### `apps/api/package.json` (relevant additions)

```json
{
  "dependencies": {
    "@rishicodes/db": "workspace:*"
  }
}
```

### `apps/api/src/prisma/prisma.service.ts`

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@rishicodes/db";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### `apps/api/src/prisma/prisma.module.ts`

`@Global()` means you register it once in `AppModule` and every feature module
gets `PrismaService` injectable without re-importing `PrismaModule`.

```ts
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### `apps/api/src/app.module.ts`

```ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    // ...other modules
  ],
})
export class AppModule {}
```

### Using PrismaService in a feature module

```ts
// apps/api/src/posts/posts.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Post } from "@rishicodes/db";

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  findOne(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }
}
```

---

## 5. apps/admin and apps/public — Next.js

Next.js apps use the `db` singleton exported from `@rishicodes/db`.
No need for any Prisma config or service setup in these apps.

### `apps/admin/package.json` and `apps/public/package.json` (relevant addition)

```json
{
  "dependencies": {
    "@rishicodes/db": "workspace:*"
  }
}
```

### Usage in server actions or route handlers

```ts
// apps/admin/src/app/posts/actions.ts
"use server";

import { db } from "@rishicodes/db";
import type { Post } from "@rishicodes/db";

export async function getPosts(): Promise<Post[]> {
  return db.post.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createPost(data: {
  title: string;
  contentJson: object;
  contentHtml: string;
}): Promise<Post> {
  return db.post.create({ data });
}

export async function publishPost(id: string): Promise<Post> {
  return db.post.update({
    where: { id },
    data: { published: true },
  });
}
```

```ts
// apps/public/src/app/api/posts/route.ts
import { db } from "@rishicodes/db";

export async function GET() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(posts);
}
```

---

## 6. Environment Variables

Create a `.env` file at the **monorepo root**. All apps and the `db` package will read from it.

```env
# Runtime — pooled connection used by the driver adapter in all three apps
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct — used only by prisma.config.ts for CLI commands and migrations
DIRECT_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
```

**Which URL does what:**

| Variable | Port | Used by | Why |
|---|---|---|---|
| `DATABASE_URL` | 6543 | Runtime app code | Transaction pooler — handles concurrent connections |
| `DIRECT_URL` | 5432 | `prisma.config.ts` / CLI | Direct connection — migrations require it |

---

## 7. Supabase Connection Strings

In your Supabase dashboard go to **Project Settings → Database → Connect**.

Copy from the **ORM tab → Prisma** — it gives you both strings pre-formatted.

The transaction pooler URL needs `?pgbouncer=true` appended. The direct URL does not.

---

## 8. Daily Workflow

### Initial setup after cloning

```bash
pnpm install           # also runs postinstall → prisma generate
```

### After changing schema.prisma

```bash
# Create and apply a new migration (dev only)
pnpm db:migrate:dev

# Regenerate the client after schema changes
pnpm db:generate
```

### Push schema without migrations (quick iteration in dev)

```bash
pnpm db:push
```

### Open Prisma Studio

```bash
pnpm db:studio
```

### Run all apps in dev

```bash
pnpm --filter api dev
pnpm --filter admin dev
pnpm --filter public dev
```

---

## 9. Render Deployment

### Environment variables

Set both on **each Render service** that uses the database:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

### Pre-deploy command (on the api service only)

Migrations run once before the API starts. The other two apps don't need this.

```bash
pnpm --filter @rishicodes/db prisma migrate deploy
```

`migrate deploy` applies existing migration files without generating new ones — safe for production.

### Build commands per service

**api (NestJS):**
```bash
pnpm --filter @rishicodes/db db:generate && pnpm --filter api build
```

**admin (Next.js):**
```bash
pnpm --filter @rishicodes/db db:generate && pnpm --filter admin build
```

**public (Next.js):**
```bash
pnpm --filter @rishicodes/db db:generate && pnpm --filter public build
```

---

## 10. How It All Fits Together

```
                    packages/db
                    ┌─────────────────────────────────┐
                    │ schema.prisma                   │
                    │   └─ defines models             │
                    │                                 │
                    │ prisma.config.ts                │
                    │   └─ DIRECT_URL → CLI only      │
                    │                                 │
                    │ src/generated/prisma/           │
                    │   └─ generated types + client  │
                    │                                 │
                    │ src/index.ts                    │
                    │   ├─ exports types              │
                    │   └─ exports db singleton       │
                    └──────────┬──────────────────────┘
                               │  @rishicodes/db
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌───────▼──────┐ ┌──────▼───────┐
    │   apps/api     │ │  apps/admin  │ │  apps/public │
    │   (NestJS)     │ │  (Next.js)   │ │  (Next.js)   │
    │                │ │              │ │              │
    │ PrismaService  │ │ import { db }│ │ import { db }│
    │ extends        │ │  from        │ │  from        │
    │ PrismaClient   │ │  @rishicodes/db    │ │  @rishicodes/db    │
    │ own adapter    │ │  singleton   │ │  singleton   │
    └────────────────┘ └──────────────┘ └──────────────┘
          │                   │                │
          └───────────────────┴────────────────┘
                              │
                         DATABASE_URL
                      (pooled — runtime)
                              │
                    ┌─────────▼─────────┐
                    │  Supabase Pooler  │
                    │  port 6543        │
                    │  pgbouncer=true   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Supabase Postgres │
                    └───────────────────┘
                              ▲
                         DIRECT_URL
                      (direct — CLI only)
```

**Key rule:** `DATABASE_URL` (pooler) goes everywhere in runtime code. `DIRECT_URL` (direct) goes only in `prisma.config.ts` and is never used at runtime.