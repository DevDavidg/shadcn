'use client'

import { useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

interface TenantThemeProviderProps {
  tenantDomain?: string
  children: React.ReactNode
}

export function TenantThemeProvider({
  tenantDomain: propTenantDomain,
  children
}: Readonly<TenantThemeProviderProps>) {
  const searchParams = useSearchParams()
  const tenantDomain = propTenantDomain || searchParams.get('tenant')

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

  const applyTheme = useCallback((themeConfig: any, root: HTMLElement) => {
    // Apply colors
    if (themeConfig.colors) {
      const { colors } = themeConfig
      if (colors.primary) {
        root.style.setProperty('--primary', hexToHsl(colors.primary))
        root.style.setProperty('--primary-foreground', '0 0% 100%')
      }

      if (colors.secondary) {
        root.style.setProperty('--secondary', hexToHsl(colors.secondary))
        root.style.setProperty('--secondary-foreground', '0 0% 0%')
      }

      if (colors.accent) {
        root.style.setProperty('--accent', hexToHsl(colors.accent))
        root.style.setProperty('--accent-foreground', '0 0% 0%')
      }

      if (colors.background) {
        root.style.setProperty('--background', hexToHsl(colors.background))
      }

      if (colors.text) {
        root.style.setProperty('--foreground', hexToHsl(colors.text))
      }

      if (colors.surface) {
        root.style.setProperty('--card', hexToHsl(colors.surface))
        root.style.setProperty(
          '--card-foreground',
          hexToHsl(colors.text || '#000000')
        )
      }

      if (colors.textMuted) {
        root.style.setProperty('--muted-foreground', hexToHsl(colors.textMuted))
      }
    }

    // Apply typography
    if (themeConfig.typography?.fontFamily?.sans) {
      root.style.setProperty(
        '--font-sans',
        themeConfig.typography.fontFamily.sans.join(', ')
      )
    }

    if (themeConfig.typography?.fontFamily?.mono) {
      root.style.setProperty(
        '--font-mono',
        themeConfig.typography.fontFamily.mono.join(', ')
      )
    }

    // Apply font sizes
    if (themeConfig.typography?.fontSize) {
      const { fontSize } = themeConfig.typography
      if (fontSize.xs) root.style.setProperty('--font-size-xs', fontSize.xs)
      if (fontSize.sm) root.style.setProperty('--font-size-sm', fontSize.sm)
      if (fontSize.base)
        root.style.setProperty('--font-size-base', fontSize.base)
      if (fontSize.lg) root.style.setProperty('--font-size-lg', fontSize.lg)
      if (fontSize.xl) root.style.setProperty('--font-size-xl', fontSize.xl)
    }

    // Apply spacing
    if (themeConfig.spacing) {
      const { spacing } = themeConfig
      if (spacing.xs) root.style.setProperty('--spacing-xs', spacing.xs)
      if (spacing.sm) root.style.setProperty('--spacing-sm', spacing.sm)
      if (spacing.md) root.style.setProperty('--spacing-md', spacing.md)
      if (spacing.lg) root.style.setProperty('--spacing-lg', spacing.lg)
      if (spacing.xl) root.style.setProperty('--spacing-xl', spacing.xl)
    }

    // Apply breakpoints
    if (themeConfig.breakpoints) {
      const { breakpoints } = themeConfig
      if (breakpoints.sm)
        root.style.setProperty('--breakpoint-sm', breakpoints.sm)
      if (breakpoints.md)
        root.style.setProperty('--breakpoint-md', breakpoints.md)
      if (breakpoints.lg)
        root.style.setProperty('--breakpoint-lg', breakpoints.lg)
      if (breakpoints.xl)
        root.style.setProperty('--breakpoint-xl', breakpoints.xl)
    }
  }, [])

  useEffect(() => {
    if (!tenantDomain) return

    const applyTenantTheme = async () => {
      try {
        const response = await fetch(`/api/theme/${tenantDomain}`)
        if (response.ok) {
          const themeConfig = await response.json()
          const root = document.documentElement

          applyTheme(themeConfig, root)

          if (themeConfig.branding?.name) {
            document.title = `${themeConfig.branding.name} - Dashboard`
          }

          document.body.classList.add('tenant-theme-applied')
        }
      } catch (error) {
        console.error('Error applying tenant theme:', error)
      }
    }

    applyTenantTheme()
  }, [tenantDomain, applyTheme])

  return <>{children}</>
}
