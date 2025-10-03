web/ # aplicación frontend Next.js
├ public/
├ src/
│ ├ app/
│ │ ├ marketing/
│ │ │ ├ page.tsx
│ │ │ ├ sitemap.ts
│ │ │ └ robots.ts
│ │ ├ dashboard/
│ │ │ ├ layout.tsx
│ │ │ ├ page.tsx
│ │ │ ├ loading.tsx
│ │ │ └ error.tsx
│ │ ├ api/
│ │ │ └ revalidate/route.ts
│ │ └ layout.tsx
│ ├ components/
│ │ ├ ui/ # componentes generados por shadcn
│ │ └ core/ # componentes comunes de dominio
│ ├ lib/
│ │ ├ fetch.ts
│ │ ├ auth.ts
│ │ ├ cache.ts
│ │ └ env.ts
│ ├ styles/
│ │ └ tailwind.css
│ └ globals.css
├ next.config.ts
├ tailwind.config.ts
├ postcss.config.js
├ tsconfig.json
└ package.json
packages/ # (opcional, si monorepo)
├ ui/ # design system compartido
└ config/ # eslint, tsconfig base, etc.
.gitignore
README.md
