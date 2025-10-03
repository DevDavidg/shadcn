import { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeEditorButton } from '@/components/ui/theme-editor-button'
import { TenantThemeProvider } from '@/components/core/tenant-theme-provider'
import { TenantThemeStyles } from '@/components/core/tenant-theme-styles'
import { formatRelativeTime, slugify } from '@/lib/utils'
import { getTenant, getTenantTheme } from '@/lib/tenant-service'
import { parseThemeConfig } from '@/lib/theme-utils'
import {
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  Plus,
  BarChart3,
  UserCog,
  Download
} from 'lucide-react'

export async function generateMetadata({
  searchParams
}: Readonly<DashboardPageProps>): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const tenantDomain = resolvedSearchParams.tenant
  let tenantConfig = null

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
      }
    } catch (error) {
      console.error('Error fetching tenant config for metadata:', error)
    }
  }

  const title = tenantConfig?.branding?.name
    ? `${tenantConfig.branding.name} Dashboard`
    : 'Dashboard Overview - Next SSR Starter'

  const description = tenantConfig?.branding?.name
    ? `${tenantConfig.branding.name} dashboard overview with key metrics and actions`
    : 'Dashboard overview with key metrics and actions'

  return {
    title,
    description
  }
}

async function getDashboardData() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const now = Date.now()

  return {
    totalUsers: 1234,
    activeProjects: 56,
    revenue: 45678,
    growth: 12.5,
    activities: [
      {
        id: 1,
        type: 'user_registered',
        message: 'New user registered',
        timestamp: now - 2 * 60 * 1000,
        status: 'success'
      },
      {
        id: 2,
        type: 'project_updated',
        message: 'Project updated',
        timestamp: now - 60 * 60 * 1000,
        status: 'info'
      },
      {
        id: 3,
        type: 'payment_processed',
        message: 'Payment processed',
        timestamp: now - 3 * 60 * 60 * 1000,
        status: 'warning'
      }
    ]
  }
}

interface DashboardPageProps {
  searchParams: Promise<{ tenant?: string }>
}

export default async function DashboardPage({
  searchParams
}: Readonly<DashboardPageProps>) {
  const data = await getDashboardData()
  const resolvedSearchParams = await searchParams
  const tenantDomain = resolvedSearchParams.tenant
  let tenantConfig = null

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
      }
    } catch (error) {
      console.error('Error fetching tenant config:', error)
    }
  }

  const generateInlineStyles = () => {
    if (!tenantConfig) return ''

    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0
      let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
        }
        h /= 6
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
    }

    let css = ':root {\n'

    // Apply colors
    if (tenantConfig.colors) {
      const { colors } = tenantConfig
      if (colors.primary) {
        css += `  --primary: ${hexToHsl(colors.primary)};\n`
        css += `  --primary-foreground: 0 0% 100%;\n`
      }
      if (colors.secondary) {
        css += `  --secondary: ${hexToHsl(colors.secondary)};\n`
        css += `  --secondary-foreground: 0 0% 0%;\n`
      }
      if (colors.accent) {
        css += `  --accent: ${hexToHsl(colors.accent)};\n`
        css += `  --accent-foreground: 0 0% 0%;\n`
      }
      if (colors.background) {
        css += `  --background: ${hexToHsl(colors.background)};\n`
      }
      if (colors.text) {
        css += `  --foreground: ${hexToHsl(colors.text)};\n`
      }
      if (colors.surface) {
        css += `  --card: ${hexToHsl(colors.surface)};\n`
        css += `  --card-foreground: ${hexToHsl(colors.text || '#000000')};\n`
      }
      if (colors.textMuted) {
        css += `  --muted-foreground: ${hexToHsl(colors.textMuted)};\n`
      }
    }

    // Apply typography
    if (tenantConfig.typography?.fontFamily?.sans) {
      css += `  --font-sans: ${tenantConfig.typography.fontFamily.sans.join(', ')};\n`
    }
    if (tenantConfig.typography?.fontFamily?.mono) {
      css += `  --font-mono: ${tenantConfig.typography.fontFamily.mono.join(', ')};\n`
    }

    // Apply font sizes
    if (tenantConfig.typography?.fontSize) {
      const { fontSize } = tenantConfig.typography
      if (fontSize.xs) css += `  --font-size-xs: ${fontSize.xs};\n`
      if (fontSize.sm) css += `  --font-size-sm: ${fontSize.sm};\n`
      if (fontSize.base) css += `  --font-size-base: ${fontSize.base};\n`
      if (fontSize.lg) css += `  --font-size-lg: ${fontSize.lg};\n`
      if (fontSize.xl) css += `  --font-size-xl: ${fontSize.xl};\n`
    }

    // Apply spacing
    if (tenantConfig.spacing) {
      const { spacing } = tenantConfig
      if (spacing.xs) css += `  --spacing-xs: ${spacing.xs};\n`
      if (spacing.sm) css += `  --spacing-sm: ${spacing.sm};\n`
      if (spacing.md) css += `  --spacing-md: ${spacing.md};\n`
      if (spacing.lg) css += `  --spacing-lg: ${spacing.lg};\n`
      if (spacing.xl) css += `  --spacing-xl: ${spacing.xl};\n`
    }

    // Apply breakpoints
    if (tenantConfig.breakpoints) {
      const { breakpoints } = tenantConfig
      if (breakpoints.sm) css += `  --breakpoint-sm: ${breakpoints.sm};\n`
      if (breakpoints.md) css += `  --breakpoint-md: ${breakpoints.md};\n`
      if (breakpoints.lg) css += `  --breakpoint-lg: ${breakpoints.lg};\n`
      if (breakpoints.xl) css += `  --breakpoint-xl: ${breakpoints.xl};\n`
    }

    css += '}\n'

    // Add custom styles for tenant theme
    css += '.tenant-theme-applied {\n'
    if (tenantConfig.typography?.fontFamily?.sans) {
      css += `  font-family: ${tenantConfig.typography.fontFamily.sans.join(', ')};\n`
    }
    css += '}\n'

    return css
  }

  return (
    <TenantThemeProvider tenantDomain={tenantDomain}>
      {tenantConfig && (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: generateInlineStyles()
            }}
          />
          <TenantThemeStyles
            tenantConfig={tenantConfig}
            tenantDomain={tenantDomain}
          />
        </>
      )}
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            {tenantConfig?.branding?.name
              ? `${tenantConfig.branding.name} Dashboard`
              : 'Dashboard Overview'}
          </h1>
          <p className="text-muted-foreground">
            {tenantConfig?.branding?.name
              ? `Welcome to your ${tenantConfig.branding.name} dashboard. Here's what's happening with your application.`
              : "Welcome to your dashboard. Here's what's happening with your application."}
          </p>
        </div>

        <div className="metric-grid grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Card className="metric-card border-l-4 border-l-primary transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="metric-label">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="metric-value text-primary">
                {data.totalUsers.toLocaleString()}
              </div>
              <p className="metric-change flex items-center gap-1 text-muted-foreground">
                <span className="font-medium text-green-600">
                  +{data.growth}%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card border-l-4 border-l-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="metric-label">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="metric-value text-secondary">
                {data.activeProjects}
              </div>
              <p className="metric-change flex items-center gap-1 text-muted-foreground">
                <span className="font-medium text-green-600">+3</span>
                new this week
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card border-l-4 border-l-accent transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="metric-label">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="metric-value text-accent">
                ${data.revenue.toLocaleString()}
              </div>
              <p className="metric-change flex items-center gap-1 text-muted-foreground">
                <span className="font-medium text-green-600">+20.1%</span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card border-l-4 border-l-primary transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="metric-label">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="metric-value text-primary">+{data.growth}%</div>
              <p className="metric-change flex items-center gap-1 text-muted-foreground">
                <span className="font-medium text-green-600">+2.5%</span>
                from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="dashboard-grid grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {tenantConfig && (
            <Card className="tenant-config-card border-primary/20 bg-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 metric-label">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  {tenantConfig.branding?.name || 'White Label'} Configuration
                </CardTitle>
                <CardDescription className="metric-change">
                  Active theme configuration for {tenantDomain}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenantConfig.branding && (
                    <div className="rounded-lg border bg-background p-4 transition-all duration-300 hover:shadow-md">
                      <h4 className="mb-2 font-medium metric-label">Brand Identity</h4>
                      <div className="space-y-2">
                        {tenantConfig.branding.name && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium metric-change">Brand:</span>
                            <span className="text-sm font-semibold text-primary metric-value">
                              {tenantConfig.branding.name}
                            </span>
                          </div>
                        )}
                        {tenantConfig.branding.logo && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium metric-change">Logo:</span>
                            <span className="text-xs text-muted-foreground metric-change">
                              {tenantConfig.branding.logo}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="rounded-lg border bg-background p-4 transition-all duration-300 hover:shadow-md">
                    <h4 className="mb-2 font-medium metric-label">Color Palette</h4>
                    <div className="color-palette-grid grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {Object.entries(tenantConfig.colors).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2 p-2 rounded transition-all duration-300 hover:bg-muted/50"
                          >
                            <div
                              className="h-4 w-4 rounded border shadow-sm"
                              style={{ backgroundColor: value as string }}
                            />
                            <span className="text-sm capitalize metric-change">{key}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="activity-card transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="metric-label">Recent Activity</CardTitle>
              <CardDescription className="metric-change">
                Latest updates from your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.activities.map((activity) => {
                  const statusColors: Record<string, string> = {
                    success: 'bg-green-500',
                    info: 'bg-primary',
                    warning: 'bg-accent'
                  }

                  return (
                    <div
                      key={activity.id}
                      className="activity-item flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 hover:bg-muted/50"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${statusColors[activity.status]}`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium metric-label">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground metric-change">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                        <p className="text-xs text-muted-foreground opacity-60 metric-change">
                          ID: {slugify(activity.type)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="actions-card transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="metric-label">Quick Actions</CardTitle>
              <CardDescription className="metric-change">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ThemeEditorButton />
                <Button className="action-button w-full justify-start transition-all duration-300 hover:scale-105" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
                <Button className="action-button w-full justify-start transition-all duration-300 hover:scale-105" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button className="action-button w-full justify-start transition-all duration-300 hover:scale-105" variant="outline">
                  <UserCog className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button className="action-button w-full justify-start transition-all duration-300 hover:scale-105" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TenantThemeProvider>
  )
}
