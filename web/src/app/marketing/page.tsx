import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Marketing - ChromaDev',
  description:
    'Marketing page showcasing the features and benefits of ChromaDev'
}

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
            Why Choose ChromaDev?
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {'A powerful multi-tenant theme management system that allows you to create, customize, and manage themes for different domains with ease.'.slice(
              0,
              150
            )}
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Optimized for speed with SSR, ISR, and intelligent caching
                strategies.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔒 Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built-in security headers, CSP, sanitization, and httpOnly
                cookies.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧪 Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete testing setup with Vitest, Testing Library, and
                Playwright.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚀 Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ready for CI/CD with GitHub Actions and Vercel deployment.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📱 Responsive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Mobile-first design with Tailwind CSS and responsive components.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Modern UI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Beautiful components with shadcn/ui and dark mode support.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            Ready to get started?
          </h2>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">Try Dashboard</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
