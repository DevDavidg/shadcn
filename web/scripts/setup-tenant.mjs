#!/usr/bin/env node

import {
  createTenant,
  getAllTenants,
  deleteTenant,
  saveTenantTheme
} from '../src/lib/tenant-service.ts'

const DEFAULT_THEME = {
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
  },
  branding: {
    name: 'Client Name',
    logo: 'https://example.com/logo.png'
  }
}

async function setupTenant(domain, customConfig = {}) {
  try {
    const config = { ...DEFAULT_THEME, ...customConfig }

    await createTenant({
      domain,
      name: config.branding.name,
      logo: config.branding.logo
    })

    await saveTenantTheme({
      tenantDomain: domain,
      config
    })

    console.log(`✅ Tenant configured for domain: ${domain}`)
    console.log('Config:', JSON.stringify(config, null, 2))
  } catch (error) {
    console.error('❌ Error setting up tenant:', error)
    process.exit(1)
  }
}

async function listTenants() {
  try {
    const tenants = await getAllTenants()
    console.log('📋 Configured tenants:')
    for (const tenant of tenants) {
      console.log(`  - ${tenant.domain} (${tenant.name})`)
    }
  } catch (error) {
    console.error('❌ Error listing tenants:', error)
    process.exit(1)
  }
}

async function deleteTenantCommand(domain) {
  try {
    await deleteTenant(domain)
    console.log(`🗑️  Deleted tenant: ${domain}`)
  } catch (error) {
    console.error('❌ Error deleting tenant:', error)
    process.exit(1)
  }
}

const command = process.argv[2]
const domain = process.argv[3]

switch (command) {
  case 'create':
    if (!domain) {
      console.error(
        '❌ Domain required: node scripts/setup-tenant.mjs create <domain>'
      )
      process.exit(1)
    }
    setupTenant(domain)
    break
  case 'list':
    listTenants()
    break
  case 'delete':
    if (!domain) {
      console.error(
        '❌ Domain required: node scripts/setup-tenant.mjs delete <domain>'
      )
      process.exit(1)
    }
    deleteTenantCommand(domain)
    break
  default:
    console.log(`
Usage: node scripts/setup-tenant.mjs <command> [domain]

Commands:
  create <domain>  - Create a new tenant configuration
  list            - List all configured tenants
  delete <domain> - Delete a tenant configuration

Examples:
  node scripts/setup-tenant.mjs create client1.example.com
  node scripts/setup-tenant.mjs list
  node scripts/setup-tenant.mjs delete client1.example.com
`)
}
