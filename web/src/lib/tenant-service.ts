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

export async function getAllTenants(): Promise<TenantDocument[]> {
  await connectDB()
  const tenants = await Tenant.find().lean()
  return tenants as unknown as TenantDocument[]
}

export async function updateTenant(
  domain: string,
  data: Partial<NewTenant>
): Promise<TenantDocument | null> {
  await connectDB()
  const tenant = await Tenant.findOneAndUpdate(
    { domain },
    { $set: data },
    { new: true }
  ).lean()
  return tenant as TenantDocument | null
}

export async function deleteTenant(domain: string): Promise<void> {
  await connectDB()
  await TenantTheme.deleteOne({ tenantDomain: domain })
  await Tenant.deleteOne({ domain })
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

export async function getAllTenantThemes(): Promise<TenantThemeDocument[]> {
  await connectDB()
  const themes = await TenantTheme.find().lean()
  return themes as unknown as TenantThemeDocument[]
}
