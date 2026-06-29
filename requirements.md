# Portfolio Monorepo — Full Implementation Guide

> Companion to `portfolio-implementation-requirements.md`. This doc covers:  
> monorepo restructure from the existing `RishiAP/RishiAP` repo (in-place, no clone needed),  
> Yarn + shadcn wiring, creative public-site redesign direction, admin UI pattern,  
> CORS/allowed-domain env config, and every configuration detail worth capturing before the first commit.

---

## 1. Monorepo Migration Strategy (Preserving RishiAP README History)

The `RishiAP/RishiAP` repo is your GitHub profile home repo — its README is
surfaced on your GitHub profile page. The entire git history must be preserved,
and the root README must stay at `README.md` in the repo root.

You're already inside the repo locally, so just restructure it in place:

```bash
# From your existing repo root (wherever you have RishiAP checked out)
mkdir -p apps/public apps/admin apps/api packages/db

# Move the existing Next.js source into apps/public
# Be careful: keep README.md at the root — do NOT move it
git mv src apps/public/src             # or whatever your src dir is called
git mv public apps/public/public       # the Next.js /public assets folder
git mv next.config.* apps/public/
git mv tailwind.config.* apps/public/
git mv tsconfig.json apps/public/
git mv postcss.config.* apps/public/
git mv components.json apps/public/    # shadcn config if present
git mv .env.local apps/public/         # move existing env file

# Keep at root: README.md, .gitignore, .github/, LICENSE if any
# The root package.json will become the workspace root (see §2)

git add -A
git commit -m "chore: restructure into monorepo — existing Next.js site → apps/public"
```

**Critical:** `README.md` at the repo root is what GitHub renders on your profile.
Keep it there. It can link to the three apps for context:

```md
# Hi, I'm Debjyoti (Rishi) 👋

> This repo is both my GitHub profile and the monorepo for [rishicodes.com](https://rishicodes.com).

## What's inside
| App | Path | Description |
|-----|------|-------------|
| Public site | `apps/public` | rishicodes.com — Next.js, ISR |
| Admin panel | `apps/admin` | admin.rishicodes.com — Next.js + Clerk |
| API | `apps/api` | api.rishicodes.com — NestJS |
```

---

## 2. Workspace Root Setup (Yarn Workspaces)

```json
// package.json (root — NOT a Next.js app, just a workspace config)
{
  "name": "rishicodes-monorepo",
  "private": true,
  "workspaces": [
    "apps/public",
    "apps/admin",
    "apps/api",
    "packages/db"
  ],
  "packageManager": "yarn@4.x.x",
  "scripts": {
    "dev:public":  "yarn workspace @rishicodes/public dev",
    "dev:admin":   "yarn workspace @rishicodes/admin dev",
    "dev:api":     "yarn workspace @rishicodes/api start:dev",
    "build:all":   "yarn workspaces foreach --all run build",
    "db:generate": "yarn workspace @rishicodes/db generate",
    "db:migrate":  "yarn workspace @rishicodes/db migrate:dev"
  }
}
```

### Shared DB package

Put Prisma in a shared workspace so both `apps/api` can import the generated
client without duplicating the schema:

```
packages/
  db/
    package.json       ← name: "@rishicodes/db"
    prisma/
      schema.prisma
    src/
      index.ts         ← re-exports PrismaClient
```

```json
// packages/db/package.json
{
  "name": "@rishicodes/db",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "scripts": {
    "generate": "prisma generate",
    "migrate:dev": "prisma migrate dev"
  },
  "dependencies": {
    "@prisma/client": "^5.x.x"
  },
  "devDependencies": {
    "prisma": "^5.x.x"
  }
}
```

```ts
// packages/db/src/index.ts
export { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
```

In NestJS `PrismaService`, import from `@rishicodes/db` instead of
`@prisma/client` directly.

---

## 3. Yarn + shadcn Setup (Each Next.js App)

### Initial shadcn init (run once per Next.js app)

```bash
cd apps/public
yarn dlx shadcn@latest init
```

The interactive prompt will ask style, base colour, CSS variables. Choose:
- Style: **Default** (not New York — better baseline for customisation)
- Base colour: **Zinc** (dark charcoal fits the terminal theme better than Slate)
- CSS variables: **Yes**

This creates `components.json` and injects the CSS variables into
`app/globals.css`. Run the same command in `apps/admin` — separate
`components.json` per app since the admin uses a different visual theme.

### Adding components with Yarn

shadcn v2+ uses a `components.json` to know where to put things. Use
`yarn dlx shadcn@latest add` with **multiple component names in one command**
(space-separated) — no global install needed, and this is faster than running
one command per component.

```bash
# Public site — install all at once
cd apps/public
yarn dlx shadcn@latest add button badge card separator tooltip sheet avatar

# Admin panel — install all at once
cd apps/admin
yarn dlx shadcn@latest add button badge card input textarea label select switch form dialog alert-dialog table dropdown-menu sonner separator skeleton tabs sheet avatar sidebar
```

> **Note on `sidebar`:** This installs the full shadcn Sidebar primitive. After
> installing, copy the **sidebar-07** block from the shadcn registry
> (`yarn dlx shadcn@latest add sidebar-07` if it's available as a block, or
> scaffold it manually using the sidebar primitive — see §5 for the full
> layout structure).

### components.json for public site

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### components.json for admin panel

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Note the different `baseColor` — Zinc for the terminal-dark public site,
Slate for the clean-grey admin panel.

---

## 4. Public Site — Creative Redesign Direction

### The design thesis

You are a backend/systems engineer. The portfolio should feel like a well-built
piece of infrastructure, not a marketing brochure. The visual language is
**the UNIX terminal meets a well-typed codebase** — not as a gimmick, but as
the medium that actually represents your work.

The differentiator: every section header is a shell prompt. Content reads like
output from commands you'd run to inspect a well-built system. The visitor isn't
browsing a portfolio — they're exploring a system.

This is not a "terminal simulator." There are no blinking cursors or fake input
boxes. It uses the vocabulary of a terminal (monospace prompts, muted comments,
pipe symbols, status indicators) as a typographic and structural system.

### Color token system

```css
/* apps/public/app/globals.css — add under the shadcn :root block */
:root {
  /* Surface */
  --bg-base:       #0f1117;   /* near-black with a blue tint, not pure black */
  --bg-surface:    #161b27;   /* cards, code blocks */
  --bg-elevated:   #1e2535;   /* hover states, active cards */
  --bg-glass:      rgba(22, 27, 39, 0.7);

  /* Accent — single accent: electric teal */
  --accent:        #00d9b1;   /* primary CTA, links, active states */
  --accent-dim:    #00a88a;   /* hover on accent */
  --accent-muted:  rgba(0, 217, 177, 0.12); /* glow backgrounds */

  /* Text */
  --text-primary:  #e8eaf0;   /* body copy */
  --text-secondary:#8892a4;   /* muted, metadata */
  --text-comment:  #4a5568;   /* inline comments, decorative */
  --text-accent:   #00d9b1;   /* accent text */

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-mid:    rgba(255, 255, 255, 0.12);
  --border-accent: rgba(0, 217, 177, 0.3);

  /* Syntax highlight palette (for tech stack badges) */
  --syn-ts:     #3b82f6;   /* TypeScript blue */
  --syn-py:     #f59e0b;   /* Python amber */
  --syn-rust:   #ef4444;   /* red-adjacent */
  --syn-c:      #8b5cf6;   /* purple for C/embedded */
  --syn-sql:    #06b6d4;   /* cyan for SQL */
  --syn-go:     #10b981;   /* go green */
}
```

Tailwind extension:
```ts
// apps/public/tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     'var(--bg-base)',
          surface:  'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dim:     'var(--accent-dim)',
          muted:   'var(--accent-muted)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          comment:   'var(--text-comment)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          mid:    'var(--border-mid)',
          accent: 'var(--border-accent)',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease both',
        'cursor':  'cursor-blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
```

### Typography

Install and register two fonts in `app/layout.tsx`:
```ts
import { Inter } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})
```

Usage rule:
- `font-mono` — all section prompts (`~/projects$`), tech stack badges,
  stat numbers, file-path-style metadata.
- `font-sans` — all body copy, card descriptions, navigation links.
- Never use monospace for multi-line body text.

### Section header pattern

Each section has a "shell prompt" divider instead of a plain `<h2>`. Example:

```tsx
// components/SectionHeader.tsx
interface Props {
  prompt: string   // e.g. "~/projects"
  label: string    // e.g. "Flagship work"
  comment?: string // e.g. "# systems built for production"
}

export function SectionHeader({ prompt, label, comment }: Props) {
  return (
    <div className="mb-10">
      <p className="font-mono text-sm text-text-comment mb-1">
        {comment}
      </p>
      <div className="flex items-center gap-2">
        <span className="font-mono text-accent text-sm">{prompt}$</span>
        <h2 className="font-mono text-2xl font-bold text-text-primary tracking-tight">
          {label}
        </h2>
      </div>
      <div className="mt-3 h-px bg-gradient-to-r from-accent/30 via-border-mid to-transparent" />
    </div>
  )
}
```

Used as:
```tsx
<SectionHeader
  prompt="~/projects"
  label="ls -la --tier=flagship"
  comment="# 4 production systems, full case studies below"
/>
```

### Hero section

Not a name + tagline on a dark background. Instead: a diff-style "who I am"
block followed by the tagline, then CTAs. The signature element is a **live
system status block** that renders GitHub metadata server-side.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   $ whoami                                              │
│   debjyoti mondal  ·  alias: rishi                      │
│                                                         │
│   ROLE     Full-Stack Software Engineer                 │
│   FOCUS    Embedded · ML pipelines · Web systems        │
│   STATUS   [● OPEN TO WORK]                            │
│                                                         │
│   [ View Projects ]  [ Resume ↓ ]  [ Contact ]         │
│                                                         │
│  ─────────────────────────────────────────────────      │
│  # recent systems                                       │
│  stress-management-system    ★ 12   last commit: 2d ago │
│  smart-parking-management    ★  8   last commit: 5d ago │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

The "recent systems" block is populated from the NestJS `/github/repo/[name]`
endpoint at ISR render time — server-fetched, never client-side.

```tsx
// app/page.tsx (server component — ISR)
export const revalidate = 600  // 10 min

async function getRepoMeta(name: string) {
  const res = await fetch(`${process.env.API_BASE_URL}/github/repo/${name}`, {
    next: { revalidate: 600 },
  })
  return res.json()
}

export default async function HomePage() {
  const [stress, parking] = await Promise.all([
    getRepoMeta('stress-management-system'),
    getRepoMeta('smart-parking-management'),
  ])
  return <HeroSection stressRepo={stress} parkingRepo={parking} />
}
```

### Flagship project card design

Not a typical "card with image + title + description." Instead, a
**spec sheet** card — the language of technical documentation:

```
┌──────────────────────────────────────────────────────────┐
│  [01]                                              [LIVE] │
│                                                          │
│  Stress Management System                                │
│  ─────────────────────────────────────────────────────   │
│  PROBLEM     Campus-wide occupancy tracking with         │
│              <100ms response at peak load.               │
│                                                          │
│  STACK       ESP32 · FastAPI · scikit-learn              │
│              Next.js · Prisma · PostgreSQL               │
│                                                          │
│  DECISION    Chose WebSocket over polling after          │
│              measuring 3× CPU savings at 500 clients.    │
│                                                          │
│              [ Read case study → ]                       │
└──────────────────────────────────────────────────────────┘
```

Key design choices:
- Left-aligned field labels in `font-mono text-xs text-text-comment`
- Content in `font-sans text-sm text-text-primary`
- Tech stack rendered as syntax-coloured inline badges (colour by language family)
- Card border: `border border-border-subtle` with `hover:border-border-accent`
  transition
- The `[01]` ordinal is decorative only — remove if the order isn't meaningful
- No hero image — diagrams live on the case study page, not the card

### Tech stack badge component

```tsx
// components/TechBadge.tsx
const colorMap: Record<string, string> = {
  TypeScript: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Python:     'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Next.js':  'bg-white/5 text-white/70 border-white/10',
  PostgreSQL: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  FastAPI:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  ESP32:      'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Redis:      'bg-red-500/10 text-red-400 border-red-500/20',
  // ... add others
}

export function TechBadge({ tech }: { tech: string }) {
  const cls = colorMap[tech] ?? 'bg-white/5 text-white/60 border-white/10'
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5
      rounded text-xs font-mono border
      ${cls}
    `}>
      {tech}
    </span>
  )
}
```

### Skills section — not an icon grid

Render skills as three grouped code blocks, styled like a config file:

```
# ~/.config/skills.toml

[core]
languages = ["TypeScript", "Python", "Java"]
frameworks = ["Next.js", "FastAPI", "NestJS", "Express"]
databases  = ["PostgreSQL", "MongoDB", "Redis"]
orm        = ["Prisma", "SQLAlchemy"]

[embedded]
mcu = ["ESP32", "ESP8266", "STM32", "Raspberry Pi Pico", "Arduino"]
lang = ["C++", "C"]

[supporting]
infra   = ["Docker", "Git", "Linux"]
auth    = ["Clerk", "JWT"]
queue   = ["Celery"]
maps    = ["MapboxGL", "PostGIS", "QGIS"]
```

This is styled, not a real `<pre>` block — but it reads like one.
Syntax highlighting uses the colour token system above. No logos, no stars,
no progress bars.

### Tier 2 "Other Work" — compact but not boring

Render these as a single horizontal scrollable row of minimal "file cards":

```
┌────────────────────────┐ ┌────────────────────────┐
│ wifi_door_controller/  │ │ esp8266_irrigation/    │
│                        │ │                        │
│ C++ · ESP8266          │ │ C++ · ESP8266          │
│ IoT access control     │ │ Automated watering     │
│                        │ │                        │
│ [github ↗]             │ [github ↗]              │
└────────────────────────┘ └────────────────────────┘
```

The filename-slash suffix on the title (`wifi_door_controller/`) is the
signature micro-detail — it reads like a directory listing.

### Education section — minimal data table

```
┌─────────────────────────────────────────────────────────┐
│  $ cat ~/.education                                     │
│                                                         │
│  2022–2026   B.Tech, Computer Engineering               │
│              GB Pant University · Pantnagar             │
│                                                         │
│  2023–pres.  BS, Data Science & Applications           │
│              IIT Madras                                 │
│                                                         │
│  2025–2026   Technical Head, The Robotics Club          │
│              GBPUAT  ·  40+ members                     │
└─────────────────────────────────────────────────────────┘
```

### Case study page layout (`/projects/[slug]`)

```
[prompt header: ~/projects/stress-management-system]

┌── Problem ─────────────────────────────────────────────┐
│   Single paragraph. What was broken, at what scale.    │
└────────────────────────────────────────────────────────┘

[Architecture diagram — full width, loaded from Supabase Storage URL]

┌── Key technical decision ──────────────────────────────┐
│   The choice, the alternatives considered, the         │
│   measured reason for the final call.                  │
└────────────────────────────────────────────────────────┘

Stack: [badge] [badge] [badge]

Links: [Live demo ↗]  [Source ↗]

[← Back to projects]
```

---

## 5. Admin Panel — shadcn sidebar-07 Layout

The admin is an internal tool. It should be clean, fast, and boring by design.
The Zinc/terminal aesthetic of the public site would be noisy here — you want
a neutral, high-readability interface that gets out of the way.

### Installing the sidebar

```bash
cd apps/admin
yarn dlx shadcn@latest add sidebar
```

Then grab the **sidebar-07** block (collapsible icon sidebar with nested nav):

```bash
yarn dlx shadcn@latest add sidebar-07
```

If `sidebar-07` isn't available as a standalone block in your shadcn version,
scaffold it manually using the `Sidebar` primitive — the structure is below.

### Admin design tokens

- Background: `slate-50` (light mode — easier on the eyes during long edit sessions)
- Sidebar: `slate-900` with white text, collapses to icon-only rail
- Content area: `slate-50` background, `white` card surfaces
- Accent: `indigo-600` for buttons, active nav, focus rings
- Font: `Inter` for everything (no mono) — this is a data-entry tool

### sidebar-07 structure

sidebar-07 is a collapsible sidebar with an icon rail, nested nav groups, and
a user footer. Wire it like this:

```tsx
// apps/admin/components/app-sidebar.tsx
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  GraduationCap,
  Wrench,
  ChevronRight,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { title: "Dashboard",  href: "/",           icon: LayoutDashboard },
  { title: "Projects",   href: "/projects",   icon: FolderKanban    },
  { title: "Blog Posts", href: "/posts",      icon: FileText        },
  { title: "Skills",     href: "/skills",     icon: Wrench          },
  { title: "Education",  href: "/education",  icon: GraduationCap   },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
                  R
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">rishicodes</span>
                  <span className="text-xs text-muted-foreground">admin panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src="/avatar.png" alt="Rishi" />
                <AvatarFallback className="rounded-lg bg-indigo-100 text-indigo-700">R</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm">Debjyoti</span>
                <span className="text-xs text-muted-foreground">admin</span>
              </div>
              <ChevronRight className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
```

### Admin root layout

```tsx
// apps/admin/app/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col bg-slate-50 min-h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          {/* breadcrumb or page title goes here */}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
```

### Shadcn components used in admin (why each one)

| Component | Route | Why |
|-----------|-------|-----|
| `sidebar` | all routes | sidebar-07 collapsible nav shell |
| `table`   | `/projects`, `/posts` | server-side paginated list of records |
| `dialog`  | delete confirmation | avoids a full page redirect for a destructive action |
| `alert-dialog` | publish/unpublish toggle | two-step confirm before changing visibility |
| `form` + `input` + `textarea` | `/projects/new`, edit | react-hook-form + zod validation |
| `select`  | Tier picker (FLAGSHIP/SUPPORTING) | constrained set of values |
| `switch`  | published toggle | binary state, needs to feel instant |
| `skeleton` | table loading states | admin can use client-side fetching + loading |
| `sonner`  | save/publish feedback | non-blocking, auto-dismisses |
| `tabs`    | edit page (Content / SEO / Settings) | organise the dense edit form |
| `sheet`   | mobile sidebar fallback | responsive drawer on narrow screens |

### Admin project edit form layout

```
Tabs: [ Content ] [ Metadata ] [ Danger zone ]

Content tab:
  Title               [input]
  Slug                [input — auto-generated, editable]
  One-line summary    [input]
  Problem             [textarea, min-h: 120px]
  Architecture note   [textarea, min-h: 120px]
  Key decision        [textarea, min-h: 100px]
  Tech stack          [tag input — comma-separated, renders as removable badges]
  Live URL            [input]
  Repo URL            [input]
  Diagram             [file upload → Supabase Storage, shows preview]

Metadata tab:
  Tier                [select: Flagship / Supporting]
  Published           [switch]
  Order               [number input]

Danger zone tab:
  [Delete project]    [alert-dialog confirm]
```

---

## 6. CORS + Allowed Domain Config (NestJS API)

This is where you enforce **which domains can call the API**. Define it
entirely via environment variables so it's different in dev, staging, and prod
without a code change.

### Environment variable shape

```bash
# apps/api/.env.production

# Comma-separated list of allowed origins for CORS
ALLOWED_ORIGINS=https://rishicodes.com,https://www.rishicodes.com,https://admin.rishicodes.com

# Vercel preview deployments (optional — add if you want PR previews to work)
# ALLOWED_ORIGINS_PATTERN=https://*-rishiap.vercel.app

# API base URL (used by Next.js apps to call the API)
API_BASE_URL=https://api.rishicodes.com

# Supabase
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...        # for migrations — bypasses pooler

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Clerk (server-side JWT verification)
CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...

# GitHub PAT — ONLY in this file, never in apps/public or apps/admin
GITHUB_PAT=ghp_...
```

```bash
# apps/api/.env.development (local dev)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
API_BASE_URL=http://localhost:3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rishicodes_dev
GITHUB_PAT=ghp_...   # use a separate PAT scoped to read:public_repo only
```

### NestJS CORS configuration

```ts
// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const allowedPattern = process.env.ALLOWED_ORIGINS_PATTERN
    ? new RegExp(
        '^' +
        process.env.ALLOWED_ORIGINS_PATTERN
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*') +
        '$'
      )
    : null;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (allowedPattern && allowedPattern.test(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
```

### Additional security headers (NestJS middleware)

```ts
// apps/api/src/security.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.removeHeader('X-Powered-By');
    next();
  }
}
```

Register in `AppModule`:
```ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
```

---

## 7. Next.js Environment Variables (Public Site + Admin)

### What belongs where

| Variable | `apps/public` | `apps/admin` | `apps/api` |
|----------|:---:|:---:|:---:|
| `NEXT_PUBLIC_API_BASE_URL` | ✓ | ✓ | — |
| `API_BASE_URL` (server-only) | ✓ | ✓ | — |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | — | ✓ | — |
| `CLERK_SECRET_KEY` | — | — | ✓ |
| `GITHUB_PAT` | **✗ NEVER** | **✗ NEVER** | ✓ |
| `DATABASE_URL` | **✗ NEVER** | **✗ NEVER** | ✓ |
| `UPSTASH_REDIS_REST_URL` | — | — | ✓ |

### apps/public/.env.production

```bash
API_BASE_URL=https://api.rishicodes.com
REVALIDATE_SECRET=your_random_32_char_secret_here
NEXT_PUBLIC_SITE_URL=https://rishicodes.com
```

### apps/admin/.env.production

```bash
API_BASE_URL=https://api.rishicodes.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SITE_URL=https://admin.rishicodes.com
```

### apps/public/next.config.ts

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
```

### apps/admin/next.config.ts

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}

export default nextConfig
```

Also add `apps/admin/public/robots.txt`:
```
User-agent: *
Disallow: /
```

---

## 8. Rate Limiting (Upstash + @nestjs/throttler)

```ts
// apps/api/src/app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from '@upstash/redis';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            name: 'short',
            ttl: 60_000,
            limit: 60,
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            url:   process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
          })
        ),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

Write endpoints (auth-guarded) skip the throttle:
```ts
@SkipThrottle()
@UseGuards(AuthGuard)
@Post('/projects')
async createProject(@Body() dto: CreateProjectDto) { ... }
```

---

## 9. ISR Revalidation Flow (Admin → Public Site)

### NestJS — trigger revalidation

```ts
// apps/api/src/projects/projects.service.ts
async update(id: string, dto: UpdateProjectDto) {
  const project = await this.prisma.project.update({
    where: { id },
    data: dto,
  });

  this.revalidatePublicSite(project.slug).catch(err =>
    console.error('Revalidation failed:', err)
  );

  return project;
}

private async revalidatePublicSite(slug: string) {
  const secret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.PUBLIC_SITE_URL;

  await fetch(`${siteUrl}/api/revalidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-secret': secret!,
    },
    body: JSON.stringify({
      tags: [`project-${slug}`, 'projects-list'],
    }),
  });
}
```

### Next.js — revalidation route handler

```ts
// apps/public/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const { tags } = await req.json();
  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, tags });
}
```

Tag your fetches in Server Components:
```ts
const res = await fetch(`${process.env.API_BASE_URL}/api/projects/${slug}`, {
  next: {
    revalidate: 600,
    tags: [`project-${slug}`],
  },
});
```

---

## 10. Clerk Auth Guard (NestJS)

```ts
// apps/api/src/auth/auth.guard.ts
import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException
} from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class AuthGuard implements CanActivate {
  private clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.slice(7);

    try {
      const payload = await this.clerk.verifyToken(token);
      request.userId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
```

---

## 11. GitHub Module (NestJS)

```ts
// apps/api/src/github/github.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Octokit } from 'octokit';

@Injectable()
export class GithubService {
  private octokit = new Octokit({ auth: process.env.GITHUB_PAT });

  private readonly allowedRepos = new Set([
    'stress-management-system',
    'smart-parking-management',
    'resume-matcher-ai',
    'nexticron-docs',
    'WiFi_ESP8266_Door_Controller',
    'esp8266_irrigation_system',
    'nexora-e-commerce',
    'RishiAP',
  ]);

  async getRepoMeta(repoName: string) {
    if (!this.allowedRepos.has(repoName)) {
      throw new NotFoundException(`Repo '${repoName}' not in allowlist`);
    }

    const { data } = await this.octokit.rest.repos.get({
      owner: 'RishiAP',
      repo: repoName,
    });

    return {
      name:        data.name,
      stars:       data.stargazers_count,
      lastPushed:  data.pushed_at,
      language:    data.language,
      description: data.description,
    };
  }
}
```

---

## 12. .gitignore (root)

```gitignore
# Dependencies
node_modules/
.yarn/cache
.yarn/install-state.gz

# Build outputs
.next/
dist/
build/

# Environment files — NEVER commit these
.env
.env.local
.env.*.local
.env.production
.env.development

# Prisma
packages/db/node_modules/

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/settings.json
.idea/
*.swp

# Vercel
.vercel/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## 13. Vercel Deployment Config

```json
// apps/public/vercel.json
{
  "framework": "nextjs",
  "buildCommand": "cd ../.. && yarn workspace @rishicodes/public build",
  "outputDirectory": "apps/public/.next",
  "installCommand": "yarn install",
  "headers": [
    {
      "source": "/sitemap.xml",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600" }]
    }
  ]
}
```

```json
// apps/admin/vercel.json
{
  "framework": "nextjs",
  "buildCommand": "cd ../.. && yarn workspace @rishicodes/admin build",
  "outputDirectory": "apps/admin/.next",
  "installCommand": "yarn install"
}
```

In the Vercel dashboard: set "Root Directory" to `apps/public` (or `apps/admin`)
for each project. Link both to the same `RishiAP/RishiAP` repo — Vercel
will auto-detect separate builds per branch.

---

## 14. SEO Wiring (Public Site)

```ts
// apps/public/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://rishicodes.com'),
  title: {
    default: 'Debjyoti Mondal — Full-Stack Software Engineer',
    template: '%s | Debjyoti Mondal',
  },
  description:
    'Building production systems across embedded, ML, and web. B.Tech @ GBPUAT + BS @ IIT Madras.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rishicodes.com',
    siteName: 'Debjyoti Mondal',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

```ts
// apps/public/app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rishicodes.com'

  const [projects, posts] = await Promise.all([
    fetch(`${process.env.API_BASE_URL}/api/projects`).then(r => r.json()),
    fetch(`${process.env.API_BASE_URL}/api/posts`).then(r => r.json()),
  ])

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...projects.map((p: { slug: string; updatedAt: string }) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...posts.map((p: { slug: string; publishedAt: string }) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
```

---

## 15. Development Workflow

```bash
# Start all three apps locally
# Terminal 1 — API (port 3002)
yarn dev:api

# Terminal 2 — Public site (port 3000)
yarn dev:public

# Terminal 3 — Admin panel (port 3001)
yarn dev:admin

# DB operations
yarn db:generate   # after schema changes
yarn db:migrate    # apply migrations

# Add shadcn components (space-separated, all at once)
cd apps/public && yarn dlx shadcn@latest add button badge card         # public
cd apps/admin  && yarn dlx shadcn@latest add table dialog sonner tabs  # admin

# Type check the whole monorepo
yarn workspaces foreach --all run typecheck
```

---

## 16. First-Commit Checklist

Before pushing the restructured repo:

- [ ] `README.md` is at the repo root and still renders your GitHub profile
- [ ] `apps/public`, `apps/admin`, `apps/api` all exist as directories
- [ ] `packages/db/prisma/schema.prisma` has the full schema from the requirements doc
- [ ] No `.env*` files are tracked (check with `git status --short | grep .env`)
- [ ] `GITHUB_PAT` is confirmed absent from `apps/public` and `apps/admin` env files
- [ ] `components.json` exists in both `apps/public` and `apps/admin` with correct `baseColor`
- [ ] `ALLOWED_ORIGINS` in `apps/api/.env.production` lists exactly:
      `https://rishicodes.com,https://www.rishicodes.com,https://admin.rishicodes.com`
- [ ] `apps/admin/public/robots.txt` contains `Disallow: /`
- [ ] Admin Next.js config sends `X-Robots-Tag: noindex, nofollow` on all routes
- [ ] Admin layout uses `SidebarProvider` wrapping `AppSidebar` + `main` content area
- [ ] shadcn `sidebar` component installed in `apps/admin` via `yarn dlx shadcn@latest add sidebar`