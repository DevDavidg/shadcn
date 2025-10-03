'use client'

import { useState } from 'react'
import { Button } from './button'
import { Card } from './card'
import { Input } from './input'

interface ThemePreviewProps {
  initialConfig?: {
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
  }
}

export function ThemePreview({ initialConfig }: ThemePreviewProps) {
  const [config, setConfig] = useState(
    initialConfig || {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textMuted: '#64748b'
      },
      typography: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace']
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }
    }
  )

  const updateColor = (key: keyof typeof config.colors, value: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }))
  }

  const generateCSS = () => {
    const { colors } = config
    return `
      :root {
        --primary: ${colors.primary};
        --secondary: ${colors.secondary};
        --accent: ${colors.accent};
        --background: ${colors.background};
        --surface: ${colors.surface};
        --text: ${colors.text};
        --text-muted: ${colors.textMuted};
      }
    `
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Color Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(config.colors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={value}
                  onChange={(e) =>
                    updateColor(
                      key as keyof typeof config.colors,
                      e.target.value
                    )
                  }
                  className="h-8 w-12 rounded border p-1"
                />
                <Input
                  value={value}
                  onChange={(e) =>
                    updateColor(
                      key as keyof typeof config.colors,
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Preview</h3>
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: config.colors.background,
            color: config.colors.text
          }}
        >
          <div className="space-y-4">
            <h4
              style={{ color: config.colors.primary }}
              className="text-xl font-bold"
            >
              Primary Heading
            </h4>
            <p style={{ color: config.colors.textMuted }}>
              This is a preview of how your theme will look with the selected
              colors.
            </p>
            <div className="flex space-x-2">
              <Button
                style={{
                  backgroundColor: config.colors.primary,
                  color: config.colors.background
                }}
              >
                Primary Button
              </Button>
              <Button
                variant="outline"
                style={{
                  borderColor: config.colors.secondary,
                  color: config.colors.secondary
                }}
              >
                Secondary Button
              </Button>
            </div>
            <div
              className="rounded p-4"
              style={{ backgroundColor: config.colors.surface }}
            >
              <p
                style={{ color: config.colors.accent }}
                className="font-medium"
              >
                Surface content with accent color
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Generated CSS</h3>
        <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
          <code>{generateCSS()}</code>
        </pre>
      </Card>
    </div>
  )
}
