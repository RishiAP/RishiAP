# RishiAP - Admin Panel (Next.js)

The content management system for the RishiAP portfolio.

## Overview
Built with **Next.js 16 (App Router)** and styled with **Tailwind CSS v4** + **shadcn/ui**. This application provides a private interface to manage Projects, Blog Posts, Education, Skills, Experience, and Social Links.
- Fully protected by **Clerk** authentication.
- Implements strict form validation using React Hook Form and Zod.
- Uses `@rishiap/lexiform` for rich text editing on blog posts.

## Dependencies & Monorepo Linkage
- It references `@rishicodes/shared-types` via `workspace:*` in `package.json` to ensure the form validations match the exact schema the backend expects.
- Dependencies are hoisted to the root of the monorepo, which is why there is no `pnpm-lock.yaml` in this directory.

## Running Locally
From the monorepo root:
```bash
pnpm --filter @rishicodes/admin dev
```
The application runs on port `3001` by default.

## Deployment
This application can be deployed to Render, Vercel, or any Node.js container.
- **Build Command**: `pnpm --filter @rishicodes/admin build`
- **Start Command**: `pnpm --filter @rishicodes/admin start`
- Ensure `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY` are provided in the environment.
