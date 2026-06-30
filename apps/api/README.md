# RishiAP - API (NestJS)

The core backend service for the RishiAP portfolio platform.

## Overview
This is a NestJS 11 application that serves as the central data provider. It exposes:
- **Public Endpoints**: Read-only endpoints for the public site to consume (Posts, Projects, Skills, Education, Experience, Social Links).
- **Admin Endpoints**: Protected endpoints guarded by Clerk authentication (`ClerkAuthGuard`) for creating, updating, and deleting content.

## Dependencies & Monorepo Linkage
- This app depends on the `@rishicodes/db` workspace for Prisma Client access to the database.
- It uses `@rishicodes/shared-types` for Zod schemas to validate incoming DTOs via the `ZodValidationPipe`.
- It does not have its own `pnpm-lock.yaml` because dependencies are managed at the root monorepo level by `pnpm`.

## Running Locally
From the monorepo root:
```bash
pnpm --filter @rishicodes/api dev
```
*(Or `pnpm dev` from the root to start all apps concurrently).*

## Deployment
This app should be deployed as a standard Node.js web service. Because this is the central API, it is responsible for running database migrations before booting.

- **Build Command**: `pnpm --filter @rishicodes/db migrate:deploy && pnpm --filter @rishicodes/api build`
- **Start Command**: `pnpm --filter @rishicodes/api start:prod`
- Ensure `DATABASE_URL`, `DIRECT_URL`, `ALLOWED_ORIGINS`, `CLERK_SECRET_KEY`, `API_BASE_URL`, `GITHUB_PAT`, `GITHUB_OWNER`, `PUBLIC_SITE_URL`, `REVALIDATE_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are provided in the environment.
