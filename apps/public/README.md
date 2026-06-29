# RishiAP - Public Portfolio (Next.js)

The highly-optimized, dynamic public-facing portfolio website.

## Overview
Built with **Next.js 16 (App Router)** and **Tailwind CSS v4**. 
- Features stunning OKLCH-based theme styling and Framer Motion animations.
- Generates pages dynamically while using Next.js Incremental Static Regeneration (ISR) with a `revalidate: 3600` config to ensure lightning-fast edge caching.
- Reads HTML directly produced by the Admin panel's Lexiform editor, styling it elegantly with `@tailwindcss/typography`.

## Dependencies & Monorepo Linkage
- It connects to the `apps/api` NestJS backend over standard HTTP fetch calls (`fetchPublicApi`).
- Uses `@rishicodes/shared-types` (`workspace:*`) for strict type safety on API responses.
- As part of the `pnpm` monorepo, packages are symlinked from the root `node_modules`.

## Running Locally
From the monorepo root:
```bash
pnpm --filter @rishicodes/public dev
```
The application runs on port `3000` by default.

## Deployment
This app generates optimized server components and cache layers. Deployable to Render, Vercel, or standard Node.js servers.
- **Build Command**: `pnpm --filter @rishicodes/public build`
- **Start Command**: `pnpm --filter @rishicodes/public start`
- Ensure `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`, `REVALIDATE_TIME`, and `GITHUB_REVALIDATE_TIME` are provided in the environment.
