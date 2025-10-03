import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core'

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  domain: text('domain').notNull().unique(),
  name: text('name').notNull(),
  logo: text('logo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const tenantThemes = pgTable('tenant_themes', {
  id: serial('id').primaryKey(),
  tenantDomain: text('tenant_domain').notNull(),
  config: text('config').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type Tenant = typeof tenants.$inferSelect
export type NewTenant = typeof tenants.$inferInsert
export type TenantTheme = typeof tenantThemes.$inferSelect
export type NewTenantTheme = typeof tenantThemes.$inferInsert
