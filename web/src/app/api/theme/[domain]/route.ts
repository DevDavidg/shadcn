import { NextRequest, NextResponse } from 'next/server'
import { parseThemeConfig } from '@/lib/theme-utils'
import { getTenantTheme, saveTenantTheme } from '@/lib/tenant-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params

    if (!domain) {
      return NextResponse.json({ error: 'Domain required' }, { status: 400 })
    }

    const theme = await getTenantTheme(domain)
    const themeConfig = parseThemeConfig(theme?.config as string)

    return NextResponse.json(themeConfig, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Theme API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params
    const body = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain required' }, { status: 400 })
    }

    await saveTenantTheme({
      tenantDomain: domain,
      config: body
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Theme API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
