# Next SSR Starter

**Ultra lightweight frontend architecture** con React + Next.js, optimizada para SSR/ISR híbrido, performance y buenas prácticas modernas.

## 🚀 Características destacadas

- SSR por defecto con **React Server Components (RSC)**, streaming y layoutes anidados
- Híbrido con **ISR / revalidación on-demand / caché por tags**
- UI construida con **shadcn/ui + Tailwind CSS + Radix primitives**
- Validaciones con **Zod**, fetch helpers con caché inteligente
- Mutaciones y UI interactiva opcional con **TanStack Query**
- Testing: **Vitest + Testing Library** para unit y componentes, **Playwright** para e2e
- CI/CD listo: scripts preparados para GitHub Actions, Vercel deploy
- Seguridad: headers, CSP, sanitización, cookies httpOnly
- Listo para monorepo (Turborepo/Nx) y escalamiento modular

## 🛠️ Stack tecnológico

- Next.js 15 (con React 19)
- shadcn/ui + Tailwind CSS
- Zod
- TanStack Query
- Vitest, Testing Library
- Playwright
- Sentry para monitoreo
- Node.js LTS

## 📦 Instalación / Getting Started

```bash
# Clonar
git clone https://github.com/tu-usuario/next-ssr-starter.git
cd next-ssr-starter/web

# Instalar dependencias
npm install
# o con pnpm / yarn
# pnpm install

# Desarrollo
npm run dev

# Construir producción
npm run build
npm run start

# Tests
npm run test
npm run test:e2e
```
