# Development Guide

This document outlines how to run, develop, and deploy the RishiAP Monorepo.

## 🏗️ Architecture Overview

This is a Turborepo managing three distinct applications:
- `apps/api`: NestJS backend. Serves as the single source of truth and the only app that connects to the database.
- `apps/admin`: Next.js private CMS. Used to manage portfolio content.
- `apps/public`: Next.js public site. Fully optimized with ISR caching and OKLCH design.

## 🚀 Running Locally

### Prerequisites
- [Node.js 20+](https://nodejs.org/en)
- [pnpm](https://pnpm.io/installation) v9+
- A PostgreSQL database (e.g. Supabase)
- A Clerk Account (for Admin Authentication)

### 1. Install Dependencies
From the root of the repository, run:
```bash
pnpm install
```
*(Note: This automatically triggers `pnpm db:generate` to generate the Prisma client).*

### 2. Set Up Environment Variables
Copy the `.env.example` files to `.env` in the following locations and fill in your credentials:
- `packages/db/.env`
- `apps/api/.env`
- `apps/admin/.env`
- `apps/public/.env`

### 3. Migrate the Database
Apply your Prisma schema to your local or remote database:
```bash
pnpm db:migrate
```

### 4. Start the Full Stack
Start all three applications and the database studio concurrently:
```bash
pnpm dev
```
- **Public Site**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3001`
- **NestJS API**: `http://localhost:3002`

## ☁️ Deployment Instructions

Because this is a Turborepo, the deploy settings for each app on Render or Vercel are slightly unique. Ensure you set the **Root Directory** correctly or use `pnpm --filter`.

### 1. The API (`apps/api`)
This is the only app responsible for database migrations.
- **Build Command**: `pnpm db:deploy && pnpm --filter @rishicodes/api build`
- **Start Command**: `pnpm --filter @rishicodes/api start:prod`
- *(The `db:deploy` command in the build step ensures the database is migrated safely before the backend boots).*

### 2. The Admin Panel (`apps/admin`)
- **Build Command**: `pnpm --filter @rishicodes/admin build`
- **Start Command**: `pnpm --filter @rishicodes/admin start`

### 3. The Public Site (`apps/public`)
- **Build Command**: `pnpm --filter @rishicodes/public build`
- **Start Command**: `pnpm --filter @rishicodes/public start`

---
*Note: Do not run `db:deploy` from the frontend apps or the root `postinstall` script, as concurrent deployments will cause race conditions and lock the database.*
