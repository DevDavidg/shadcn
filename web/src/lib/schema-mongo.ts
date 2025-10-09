import mongoose from 'mongoose'

const tenantSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    collection: 'tenants'
  }
)

const tenantThemeSchema = new mongoose.Schema(
  {
    tenantDomain: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    config: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'tenant_themes'
  }
)

export const Tenant =
  mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema)
export const TenantTheme =
  mongoose.models.TenantTheme ||
  mongoose.model('TenantTheme', tenantThemeSchema)

export type TenantDocument = mongoose.InferSchemaType<typeof tenantSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export type TenantThemeDocument = mongoose.InferSchemaType<
  typeof tenantThemeSchema
> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export type NewTenant = {
  domain: string
  name: string
  logo?: string
}

export type NewTenantTheme = {
  tenantDomain: string
  config: string | object
}
