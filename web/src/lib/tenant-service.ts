import { eq } from 'drizzle-orm'
import { db } from './db'
import {
  tenants,
  tenantThemes,
  type Tenant,
  type NewTenant,
  type TenantTheme,
  type NewTenantTheme
} from './schema'

export async function createTenant(data: NewTenant) {
  const [tenant] = await db.insert(tenants).values(data).returning()
  return tenant
}

export async function getTenant(domain: string): Promise<Tenant | null> {
  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.domain, domain))
    .limit(1)
  return tenant || null
}

export async function getAllTenants(): Promise<Tenant[]> {
  return await db.select().from(tenants)
}

export async function updateTenant(domain: string, data: Partial<NewTenant>) {
  const [tenant] = await db
    .update(tenants)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(tenants.domain, domain))
    .returning()
  return tenant
}

export async function deleteTenant(domain: string) {
  await db.delete(tenantThemes).where(eq(tenantThemes.tenantDomain, domain))
  await db.delete(tenants).where(eq(tenants.domain, domain))
}

export async function saveTenantTheme(data: NewTenantTheme) {
  const existing = await getTenantTheme(data.tenantDomain)

  const themeData = {
    ...data,
    config:
      typeof data.config === 'string'
        ? data.config
        : JSON.stringify(data.config),
    updatedAt: new Date().toISOString()
  }

  if (existing) {
    const [theme] = await db
      .update(tenantThemes)
      .set(themeData)
      .where(eq(tenantThemes.tenantDomain, data.tenantDomain))
      .returning()
    return theme
  } else {
    const [theme] = await db.insert(tenantThemes).values(themeData).returning()
    return theme
  }
}

export async function getTenantTheme(
  domain: string
): Promise<TenantTheme | null> {
  const [theme] = await db
    .select()
    .from(tenantThemes)
    .where(eq(tenantThemes.tenantDomain, domain))
    .limit(1)
  return theme || null
}

export async function getAllTenantThemes(): Promise<TenantTheme[]> {
  return await db.select().from(tenantThemes)
}
