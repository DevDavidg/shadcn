import connectDB from './db'
import {
  Tenant,
  TenantTheme,
  type TenantDocument,
  type TenantThemeDocument,
  type NewTenant,
  type NewTenantTheme
} from './schema-mongo'

export type {
  TenantDocument as Tenant,
  NewTenant,
  TenantThemeDocument as TenantTheme,
  NewTenantTheme
}

export async function createTenant(data: NewTenant): Promise<TenantDocument> {
  await connectDB()
  const tenant = await Tenant.create(data)
  return tenant.toObject() as TenantDocument
}

export async function getTenant(
  domain: string
): Promise<TenantDocument | null> {
  await connectDB()
  const tenant = await Tenant.findOne({ domain }).lean()
  return tenant as TenantDocument | null
}

export async function saveTenantTheme(
  data: NewTenantTheme
): Promise<TenantThemeDocument> {
  await connectDB()

  const config =
    typeof data.config === 'string' ? data.config : JSON.stringify(data.config)

  const theme = await TenantTheme.findOneAndUpdate(
    { tenantDomain: data.tenantDomain },
    { $set: { tenantDomain: data.tenantDomain, config } },
    { upsert: true, new: true }
  ).lean()

  return theme as unknown as TenantThemeDocument
}

export async function getTenantTheme(
  domain: string
): Promise<TenantThemeDocument | null> {
  await connectDB()
  const theme = await TenantTheme.findOne({ tenantDomain: domain }).lean()
  return theme as TenantThemeDocument | null
}
