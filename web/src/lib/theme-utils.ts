import { DEFAULT_THEME } from './constants'

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textMuted: string
  }
  typography: {
    fontFamily: {
      sans: string[]
      mono: string[]
    }
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  branding?: {
    logo?: string
    favicon?: string
    name?: string
  }
}

export function parseThemeConfig(config: string | null): ThemeConfig {
  if (!config) return JSON.parse(DEFAULT_THEME)
  try {
    return JSON.parse(config)
  } catch {
    return JSON.parse(DEFAULT_THEME)
  }
}

export function generateCSSVariables(config: ThemeConfig): string {
  const { colors, typography, spacing, breakpoints } = config

  return `
    :root {
      --primary: ${hexToHsl(colors.primary)};
      --primary-foreground: ${getContrastColor(colors.primary)};
      --secondary: ${hexToHsl(colors.secondary)};
      --secondary-foreground: ${getContrastColor(colors.secondary)};
      --accent: ${hexToHsl(colors.accent)};
      --accent-foreground: ${getContrastColor(colors.accent)};
      --background: ${hexToHsl(colors.background)};
      --foreground: ${hexToHsl(colors.text)};
      --card: ${hexToHsl(colors.surface)};
      --card-foreground: ${hexToHsl(colors.text)};
      --popover: ${hexToHsl(colors.surface)};
      --popover-foreground: ${hexToHsl(colors.text)};
      --muted: ${hexToHsl(colors.textMuted)};
      --muted-foreground: ${hexToHsl(colors.textMuted)};
      --border: ${hexToHsl(colors.textMuted)} / 0.2;
      --input: ${hexToHsl(colors.textMuted)} / 0.2;
      --ring: ${hexToHsl(colors.primary)};
      --radius: 0.5rem;
      
      --font-sans: ${typography.fontFamily.sans.join(', ')};
      --font-mono: ${typography.fontFamily.mono.join(', ')};
      
      --spacing-xs: ${spacing.xs};
      --spacing-sm: ${spacing.sm};
      --spacing-md: ${spacing.md};
      --spacing-lg: ${spacing.lg};
      --spacing-xl: ${spacing.xl};
      
      --breakpoint-sm: ${breakpoints.sm};
      --breakpoint-md: ${breakpoints.md};
      --breakpoint-lg: ${breakpoints.lg};
      --breakpoint-xl: ${breakpoints.xl};
    }
    
    .dark {
      --background: ${hexToHsl(darkenColor(colors.background))};
      --foreground: ${hexToHsl(lightenColor(colors.text))};
      --card: ${hexToHsl(darkenColor(colors.surface))};
      --card-foreground: ${hexToHsl(lightenColor(colors.text))};
      --popover: ${hexToHsl(darkenColor(colors.surface))};
      --popover-foreground: ${hexToHsl(lightenColor(colors.text))};
      --primary: ${hexToHsl(lightenColor(colors.primary))};
      --primary-foreground: ${hexToHsl(darkenColor(colors.background))};
      --secondary: ${hexToHsl(darkenColor(colors.secondary))};
      --secondary-foreground: ${hexToHsl(lightenColor(colors.text))};
      --muted: ${hexToHsl(darkenColor(colors.textMuted))};
      --muted-foreground: ${hexToHsl(lightenColor(colors.textMuted))};
      --accent: ${hexToHsl(darkenColor(colors.accent))};
      --accent-foreground: ${hexToHsl(lightenColor(colors.text))};
      --border: ${hexToHsl(lightenColor(colors.textMuted))} / 0.2;
      --input: ${hexToHsl(lightenColor(colors.textMuted))} / 0.2;
      --ring: ${hexToHsl(lightenColor(colors.primary))};
    }
  `
}

function hexToHsl(hex: string): string {
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

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '0 0% 0%' : '0 0% 100%'
}

function darkenColor(hex: string, factor = 0.2): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) * (1 - factor))
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) * (1 - factor))
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) * (1 - factor))
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
}

function lightenColor(hex: string, factor = 0.2): string {
  const r = Math.min(
    255,
    parseInt(hex.slice(1, 3), 16) +
      (255 - parseInt(hex.slice(1, 3), 16)) * factor
  )
  const g = Math.min(
    255,
    parseInt(hex.slice(3, 5), 16) +
      (255 - parseInt(hex.slice(3, 5), 16)) * factor
  )
  const b = Math.min(
    255,
    parseInt(hex.slice(5, 7), 16) +
      (255 - parseInt(hex.slice(5, 7), 16)) * factor
  )
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
}
