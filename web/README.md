# Next SSR Starter

Ultra lightweight frontend architecture with React + Next.js, optimized for SSR/ISR hybrid, performance and modern best practices.

## Features

- SSR by default with React Server Components (RSC), streaming and nested layouts
- Hybrid with ISR / on-demand revalidation / cache by tags
- UI built with shadcn/ui + Tailwind CSS + Radix primitives
- Validations with Zod, fetch helpers with intelligent caching
- Mutations and interactive UI with TanStack Query
- Testing: Vitest + Testing Library for unit and components, Playwright for e2e
- CI/CD ready: scripts prepared for GitHub Actions, Vercel deploy
- Security: headers, CSP, sanitization, httpOnly cookies
- Ready for monorepo (Turborepo/Nx) and modular scaling

## Tech Stack

- Next.js 15 (with React 19)
- shadcn/ui + Tailwind CSS
- Zod
- TanStack Query
- Vitest, Testing Library
- Playwright
- Sentry for monitoring
- Node.js LTS

## Getting Started

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build production
npm run build
npm run start

# Tests
npm run test
npm run test:e2e
```

## Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── marketing/       # Marketing pages
│   │   ├── dashboard/       # Dashboard pages
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   └── core/           # Domain components
│   ├── lib/                # Utilities and helpers
│   └── styles/             # Global styles
├── src/test/               # Test files
└── public/                 # Static assets
```

## Architecture Patterns

- **Atomic Design**: Reusable atomic components in components/ui, domain components in components/core
- **Clean/Hexagonal**: Separation of business logic, infrastructure, UI
- **Fetch helpers and cache layer** in lib/fetch.ts
- **Route Handlers and Server Actions** for internal endpoints and mutations
- **Selective revalidation**: Using revalidateTag, cache tags and revalidate in specific routes

## Contributing

1. Add new components via `npx shadcn add X`
2. Create private blocks in internal registry
3. Add routes in app/ with SSR or ISR as needed
4. Follow the established patterns and conventions

## License

MIT
