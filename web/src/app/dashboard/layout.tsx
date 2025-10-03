import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TenantThemeProvider } from '@/components/core/tenant-theme-provider'

export const metadata: Metadata = {
  title: 'Dashboard - Next SSR Starter',
  description: 'Dashboard for managing your application'
}

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <TenantThemeProvider>
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link
                  href="/dashboard"
                  className="text-xl font-bold text-foreground"
                >
                  Dashboard
                </Link>
                <div className="hidden space-x-6 md:flex">
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Settings
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </TenantThemeProvider>
  )
}
