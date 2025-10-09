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
import { getTenant, getTenantTheme } from '@/lib/tenant-service'
import { parseThemeConfig } from '@/lib/theme-utils'
import { TenantThemeProvider } from '@/components/core/tenant-theme-provider'
import { TenantThemeStyles } from '@/components/core/tenant-theme-styles'

interface MarketingPageProps {
  searchParams: Promise<{ tenant?: string }>
}

export async function generateMetadata({
  searchParams
}: MarketingPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const tenantDomain = resolvedSearchParams.tenant
  let tenantName = 'Platform'

  if (tenantDomain) {
    const tenant = await getTenant(tenantDomain)
    if (tenant) {
      tenantName = tenant.name
    }
  }

  return {
    title: `Marketing - ${tenantName}`,
    description: `Discover the features and benefits of ${tenantName}`
  }
}

export default async function MarketingPage({
  searchParams
}: Readonly<MarketingPageProps>) {
  const resolvedSearchParams = await searchParams
  const tenantDomain = resolvedSearchParams.tenant
  let tenantConfig = null
  let brandName = 'Our Platform'

  if (tenantDomain) {
    try {
      const tenant = await getTenant(tenantDomain)
      const theme = await getTenantTheme(tenantDomain)
      if (tenant && theme) {
        const parsedTheme = parseThemeConfig(theme.config)
        tenantConfig = {
          ...parsedTheme,
          branding: {
            name: tenant.name,
            logo: tenant.logo
          }
        }
        brandName = tenant.name
      }
    } catch (error) {
      console.error('Error fetching tenant config:', error)
    }
  }

  const features = [
    {
      title: 'Innovation',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${brandName} provides cutting-edge solutions.`
    },
    {
      title: 'Performance',
      description: `Sed do eiusmod tempor incididunt ut labore. Optimized for ${brandName} speed and efficiency.`
    },
    {
      title: 'Security',
      description: `Ut enim ad minim veniam, quis nostrud exercitation. ${brandName} ensures data protection.`
    },
    {
      title: 'Precision',
      description: `Duis aute irure dolor in reprehenderit in voluptate. ${brandName} delivers accurate results.`
    },
    {
      title: 'Analytics',
      description: `Excepteur sint occaecat cupidatat non proident. Track ${brandName} metrics efficiently.`
    },
    {
      title: 'Scalability',
      description: `Sunt in culpa qui officia deserunt mollit anim. ${brandName} grows with your needs.`
    }
  ]

  return (
    <TenantThemeProvider tenantDomain={tenantDomain}>
      {tenantConfig && (
        <TenantThemeStyles
          tenantConfig={tenantConfig}
          tenantDomain={tenantDomain}
        />
      )}
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold text-foreground">
              {tenantConfig?.branding?.name
                ? `Why Choose ${tenantConfig.branding.name}?`
                : 'Why Choose Us?'}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {tenantConfig?.branding?.name
                ? `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${tenantConfig.branding.name} offers innovative solutions tailored to your business needs with excellence and dedication.`
                : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Discover innovative solutions tailored to your business needs with excellence and dedication.'}
            </p>
          </div>

          <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <h2 className="mb-8 text-3xl font-bold text-foreground">
              {tenantConfig?.branding?.name
                ? `Ready to experience ${tenantConfig.branding.name}?`
                : 'Ready to get started?'}
            </h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link
                  href={
                    tenantDomain
                      ? `/dashboard?tenant=${tenantDomain}`
                      : '/dashboard'
                  }
                >
                  {tenantConfig?.branding?.name
                    ? `Try ${tenantConfig.branding.name}`
                    : 'Try Dashboard'}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={tenantDomain ? `/?tenant=${tenantDomain}` : '/'}>
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TenantThemeProvider>
  )
}
