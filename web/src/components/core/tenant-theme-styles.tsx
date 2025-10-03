'use client'

import { useEffect } from 'react'

interface TenantThemeStylesProps {
  tenantConfig: any
  tenantDomain?: string
}

export function TenantThemeStyles({
  tenantConfig,
  tenantDomain
}: TenantThemeStylesProps) {
  useEffect(() => {
    if (!tenantConfig) return

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

    const root = document.documentElement

    if (tenantConfig.colors.primary) {
      root.style.setProperty('--primary', hexToHsl(tenantConfig.colors.primary))
      root.style.setProperty('--primary-foreground', '0 0% 100%')
    }

    if (tenantConfig.colors.secondary) {
      root.style.setProperty(
        '--secondary',
        hexToHsl(tenantConfig.colors.secondary)
      )
      root.style.setProperty('--secondary-foreground', '0 0% 0%')
    }

    if (tenantConfig.colors.accent) {
      root.style.setProperty('--accent', hexToHsl(tenantConfig.colors.accent))
      root.style.setProperty('--accent-foreground', '0 0% 0%')
    }

    if (tenantConfig.colors.background) {
      root.style.setProperty(
        '--background',
        hexToHsl(tenantConfig.colors.background)
      )
    }

    if (tenantConfig.colors.text) {
      root.style.setProperty('--foreground', hexToHsl(tenantConfig.colors.text))
    }

    if (tenantConfig.colors.surface) {
      root.style.setProperty('--card', hexToHsl(tenantConfig.colors.surface))
      root.style.setProperty(
        '--card-foreground',
        hexToHsl(tenantConfig.colors.text || '#000000')
      )
    }

    if (tenantConfig.colors.textMuted) {
      root.style.setProperty(
        '--muted-foreground',
        hexToHsl(tenantConfig.colors.textMuted)
      )
    }

    // Apply typography
    if (tenantConfig.typography?.fontFamily?.sans) {
      root.style.setProperty(
        '--font-sans',
        tenantConfig.typography.fontFamily.sans.join(', ')
      )
    }

    if (tenantConfig.typography?.fontFamily?.mono) {
      root.style.setProperty(
        '--font-mono',
        tenantConfig.typography.fontFamily.mono.join(', ')
      )
    }

    // Apply font sizes
    if (tenantConfig.typography?.fontSize) {
      const { fontSize } = tenantConfig.typography
      if (fontSize.xs) root.style.setProperty('--font-size-xs', fontSize.xs)
      if (fontSize.sm) root.style.setProperty('--font-size-sm', fontSize.sm)
      if (fontSize.base)
        root.style.setProperty('--font-size-base', fontSize.base)
      if (fontSize.lg) root.style.setProperty('--font-size-lg', fontSize.lg)
      if (fontSize.xl) root.style.setProperty('--font-size-xl', fontSize.xl)
    }

    // Apply spacing
    if (tenantConfig.spacing) {
      const { spacing } = tenantConfig
      if (spacing.xs) root.style.setProperty('--spacing-xs', spacing.xs)
      if (spacing.sm) root.style.setProperty('--spacing-sm', spacing.sm)
      if (spacing.md) root.style.setProperty('--spacing-md', spacing.md)
      if (spacing.lg) root.style.setProperty('--spacing-lg', spacing.lg)
      if (spacing.xl) root.style.setProperty('--spacing-xl', spacing.xl)
    }

    // Apply breakpoints
    if (tenantConfig.breakpoints) {
      const { breakpoints } = tenantConfig
      if (breakpoints.sm)
        root.style.setProperty('--breakpoint-sm', breakpoints.sm)
      if (breakpoints.md)
        root.style.setProperty('--breakpoint-md', breakpoints.md)
      if (breakpoints.lg)
        root.style.setProperty('--breakpoint-lg', breakpoints.lg)
      if (breakpoints.xl)
        root.style.setProperty('--breakpoint-xl', breakpoints.xl)
    }

    // Apply custom CSS variables for Tailwind
    if (tenantConfig.typography?.fontFamily?.sans) {
      root.style.setProperty(
        '--font-family-sans',
        tenantConfig.typography.fontFamily.sans.join(', ')
      )
    }

    if (tenantConfig.typography?.fontFamily?.mono) {
      root.style.setProperty(
        '--font-family-mono',
        tenantConfig.typography.fontFamily.mono.join(', ')
      )
    }

    if (tenantConfig.branding?.name) {
      document.title = `${tenantConfig.branding.name} Dashboard`
    }

    document.body.classList.add('tenant-theme-applied')

    return () => {
      document.body.classList.remove('tenant-theme-applied')
    }
  }, [tenantConfig, tenantDomain])

  return null
}
