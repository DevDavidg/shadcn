import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createTenant, saveTenantTheme } from '@/lib/tenant-service'

const ThemeConfigSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    surface: z.string(),
    text: z.string(),
    textMuted: z.string()
  }),
  typography: z.object({
    fontFamily: z.object({
      sans: z.array(z.string()),
      mono: z.array(z.string())
    }),
    fontSize: z.object({
      xs: z.string(),
      sm: z.string(),
      base: z.string(),
      lg: z.string(),
      xl: z.string()
    })
  }),
  spacing: z.object({
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string()
  }),
  breakpoints: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string()
  }),
  branding: z
    .object({
      logo: z.string().optional(),
      favicon: z.string().optional(),
      name: z.string().optional()
    })
    .optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, config } = body

    if (!domain) {
      return NextResponse.json({ error: 'Domain required' }, { status: 400 })
    }

    const validatedConfig = ThemeConfigSchema.parse(config)

    // Create tenant in database
    await createTenant({
      domain,
      name: validatedConfig.branding?.name || 'Custom Tenant',
      logo: validatedConfig.branding?.logo
    })

    // Save theme configuration
    await saveTenantTheme({
      tenantDomain: domain,
      config: JSON.stringify(validatedConfig)
    })

    // Also save to KV if available (for production)
    try {
      await kv.set(`tenant-config:${domain}`, JSON.stringify(validatedConfig))
    } catch (kvError) {
      console.warn('KV not available, using database only:', kvError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid config', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Admin theme API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')

    if (!domain) {
      return NextResponse.json({ error: 'Domain required' }, { status: 400 })
    }

    await kv.del(`tenant-config:${domain}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin theme API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
