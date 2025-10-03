import { redirect } from 'next/navigation'
import { getTenantTheme } from '@/lib/tenant-service'
import { parseThemeConfig } from '@/lib/theme-utils'

interface ThemePreviewPageProps {
  searchParams: Promise<{ host?: string }>
}

export default async function ThemePreviewPage({
  searchParams
}: Readonly<ThemePreviewPageProps>) {
  const { host } = await searchParams

  if (!host) {
    redirect('/')
  }

  let themeConfig = null
  try {
    const theme = await getTenantTheme(host)
    if (theme) {
      themeConfig = parseThemeConfig(theme.config)
    }
  } catch (error) {
    console.error('Error fetching theme config:', error)
  }

  if (!themeConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Theme Not Found
          </h1>
          <p className="mb-4 text-gray-600">
            No theme configuration found for: {host}
          </p>
          <a
            href="/marketing"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Theme Editor
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: themeConfig.colors.background }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1
              className="mb-4 text-4xl font-bold"
              style={{ color: themeConfig.colors.primary }}
            >
              {themeConfig.branding?.name || 'Theme Preview'}
            </h1>
            <p
              className="text-lg"
              style={{ color: themeConfig.colors.textMuted }}
            >
              Domain: {host}
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: themeConfig.colors.surface,
                borderColor: themeConfig.colors.textMuted + '20'
              }}
            >
              <h3
                className="mb-3 text-xl font-semibold"
                style={{ color: themeConfig.colors.primary }}
              >
                Primary Card
              </h3>
              <p style={{ color: themeConfig.colors.text }}>
                This is a sample card with the primary theme colors applied.
              </p>
            </div>

            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: themeConfig.colors.surface,
                borderColor: themeConfig.colors.textMuted + '20'
              }}
            >
              <h3
                className="mb-3 text-xl font-semibold"
                style={{ color: themeConfig.colors.secondary }}
              >
                Secondary Card
              </h3>
              <p style={{ color: themeConfig.colors.text }}>
                This card uses secondary colors from your theme configuration.
              </p>
            </div>

            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: themeConfig.colors.surface,
                borderColor: themeConfig.colors.textMuted + '20'
              }}
            >
              <h3
                className="mb-3 text-xl font-semibold"
                style={{ color: themeConfig.colors.accent }}
              >
                Accent Card
              </h3>
              <p style={{ color: themeConfig.colors.text }}>
                This card showcases the accent color from your theme.
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: themeConfig.colors.primary }}
            >
              <h3
                className="mb-3 text-xl font-semibold"
                style={{ color: themeConfig.colors.background }}
              >
                Primary Background
              </h3>
              <p style={{ color: themeConfig.colors.background }}>
                This section uses the primary color as background with
                contrasting text.
              </p>
            </div>

            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: themeConfig.colors.accent }}
            >
              <h3
                className="mb-3 text-xl font-semibold"
                style={{ color: themeConfig.colors.background }}
              >
                Accent Background
              </h3>
              <p style={{ color: themeConfig.colors.background }}>
                This section uses the accent color as background.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex space-x-4">
              <button
                className="rounded-lg px-6 py-3 font-medium"
                style={{
                  backgroundColor: themeConfig.colors.primary,
                  color: themeConfig.colors.background
                }}
              >
                Primary Button
              </button>
              <button
                className="rounded-lg border-2 px-6 py-3 font-medium"
                style={{
                  borderColor: themeConfig.colors.secondary,
                  color: themeConfig.colors.secondary,
                  backgroundColor: 'transparent'
                }}
              >
                Secondary Button
              </button>
              <button
                className="rounded-lg px-6 py-3 font-medium"
                style={{
                  backgroundColor: themeConfig.colors.accent,
                  color: themeConfig.colors.background
                }}
              >
                Accent Button
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/marketing"
              className="inline-block rounded border px-4 py-2"
              style={{
                borderColor: themeConfig.colors.textMuted,
                color: themeConfig.colors.textMuted
              }}
            >
              ← Back to Theme Editor
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
