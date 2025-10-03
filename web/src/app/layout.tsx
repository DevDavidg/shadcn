import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { ThemeProvider } from '@/components/core/theme-provider'
import { QueryProvider } from '@/components/core/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { generateCSSVariables, parseThemeConfig } from '@/lib/theme-utils'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next SSR Starter',
  description: 'Ultra lightweight frontend architecture with React + Next.js',
  keywords: ['Next.js', 'React', 'SSR', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Next SSR Starter',
    description: 'Ultra lightweight frontend architecture with React + Next.js',
    siteName: 'Next SSR Starter'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next SSR Starter',
    description: 'Ultra lightweight frontend architecture with React + Next.js',
    creator: '@yourusername'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default async function RootLayout({
  children
}: {
  readonly children: React.ReactNode
}) {
  const headersList = await headers()
  const themeConfigHeader = headersList.get('x-theme-config')
  const themeConfig = parseThemeConfig(themeConfigHeader)
  const cssVariables = generateCSSVariables(themeConfig)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
