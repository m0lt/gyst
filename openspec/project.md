# Project Context

## Purpose
Gyst is a Next.js application built with Supabase for backend and authentication. Started as a Supabase starter kit template, it provides a foundation for building modern web applications with server-side rendering, authentication, and database capabilities.

## Tech Stack

### Frontend
- **Next.js 16** (latest) - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework (latest, using @import and @theme syntax)
- **tailwindcss-animate** - Animation utilities
- **next-themes** - Dark mode support
- **Radix UI** - Headless UI components
  - react-checkbox
  - react-dropdown-menu
  - react-label
  - react-slot
- **lucide-react** - Icon library
- **class-variance-authority** - CVA for component variants
- **clsx** & **tailwind-merge** - Utility class management

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - @supabase/supabase-js (latest) - JavaScript client
  - @supabase/ssr (latest) - Server-side rendering support with cookie-based auth
- **PostgreSQL** - Database (via Supabase)

### Development Tools
- **ESLint 9** - Code linting
- **Turbopack** - Next.js bundler (via --turbopack flag)
- **Supabase CLI** - Database type generation and management

## Project Conventions

### Code Style
- **Language**: TypeScript with strict mode enabled
- **Component Pattern**: Functional components with hooks
- **File Naming**:
  - Components: PascalCase (e.g., `UserProfile.tsx`)
  - Utilities: kebab-case (e.g., `api-config.ts`)
  - Routes: kebab-case following Next.js App Router conventions
- **Import Organization**: External dependencies first, then local imports
- **Utility Function**: Use `cn()` from `lib/utils.ts` for className merging (clsx + twMerge)

### Architecture Patterns

#### File Structure
```
app/                    # Next.js App Router pages and routes
├── auth/              # Authentication routes
├── protected/         # Protected pages
├── globals.css        # Global styles with Tailwind v4
└── layout.tsx         # Root layout

components/            # Reusable React components
lib/                  # Utilities and shared logic
├── supabase/         # Supabase client configurations
│   ├── client.ts     # Browser client
│   ├── server.ts     # Server client
│   └── middleware.ts # Middleware client
└── utils.ts          # Utility functions

openspec/             # OpenSpec documentation
├── specs/            # Current specs (what IS built)
├── changes/          # Active proposals (what SHOULD change)
└── project.md        # This file
```

#### Supabase Integration
- **Client-side**: Use `createClient()` from `lib/supabase/client.ts`
- **Server-side**: Use server functions from `lib/supabase/server.ts`
- **Middleware**: Use middleware client for route protection
- **Authentication**: Cookie-based auth via @supabase/ssr
- **Type Safety**: Generate types with `npm run gen-types`

#### Styling
- **Tailwind v4**: Use `@import "tailwindcss"` and `@theme` blocks
- **Color System**: CSS variables in OKLCH format with `--color-` prefix
  - Access via utility classes: `bg-background`, `text-foreground`, etc.
- **Dark Mode**: Configured with `next-themes` using class strategy
- **Component Variants**: Use CVA (class-variance-authority) for component variations

### Testing Strategy
- Not yet defined (inherited from starter kit)
- Future: Consider adding Vitest or Jest for unit tests
- Future: Consider Playwright for E2E tests

### Git Workflow
- **Branch**: Currently on `main` branch
- **Commits**: Conventional commits preferred
- **npm Scripts**:
  - `npm run dev` - Start development server with Turbopack
  - `npm run build` - Production build
  - `npm run start` - Production server
  - `npm run lint` - Run ESLint
  - `npm run gen-types` - Generate Supabase database types

## Domain Context

### Authentication Flow
- Password-based authentication using Supabase Auth
- Cookie-based session management
- Protected routes use middleware for auth checks
- User session available across Client Components, Server Components, Route Handlers, and Server Actions

### Database
- Supabase PostgreSQL database
- Type definitions auto-generated in `database.types.ts`
- Project ID: `fjfswufsvfdrrotvmajv`
- Public schema in use

## Important Constraints

### Technical
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Anon/public key (never use service_role key in frontend!)
  - `SUPABASE_ACCESS_TOKEN` - For Supabase CLI operations
- **Tailwind v4**: No tailwind.config file needed, configuration in CSS via @theme
- **PostCSS**: Not required (removed, integrated in Tailwind v4)
- **Autoprefixer**: Not required (removed, integrated in Tailwind v4)

### Development
- Dev server runs on port 3000 by default
- TypeScript strict mode enabled
- All components should be typed

## External Dependencies

### Supabase
- **Project URL**: https://fjfswufsvfdrrotvmajv.supabase.co
- **Services**: Authentication, Database, Storage (if needed)
- **API Documentation**: https://supabase.com/docs

### Deployment
- Optimized for Vercel deployment
- Supabase Vercel Integration available for automatic environment variable setup

### UI Components
- Radix UI primitives for accessible, unstyled components
- shadcn/ui patterns (components can be customized)
- Lucide icons for consistent iconography
