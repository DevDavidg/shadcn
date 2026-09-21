# MongoDB Migration Summary

## ✅ Migration Complete

The application has been successfully migrated from PostgreSQL/SQLite to MongoDB.

## Changes Made

### 1. Dependencies

- ✅ Installed `mongoose` and `@types/mongoose`
- ❌ Removed: `drizzle-orm`, `better-sqlite3`, `postgres`, `pg` (can be uninstalled)

### 2. Files Modified

#### New Files

- `src/lib/schema-mongo.ts` - Mongoose schemas and types
- `src/lib/db.ts` - MongoDB connection with caching
- `MONGODB_SETUP.md` - Setup and deployment guide
- `MONGODB_MIGRATION.md` - This file

#### Updated Files

- `src/lib/env.ts` - Changed to MONGODB_URI
- `src/lib/tenant-service.ts` - Rewritten using Mongoose
- `src/app/api/theme/[domain]/route.ts` - No changes needed
- `src/app/api/admin/theme/route.ts` - No changes needed
- `env.example` - Updated for MongoDB
- `README.md` - Updated documentation

### 3. Architecture Changes

**Before (PostgreSQL/SQLite):**

```
Drizzle ORM → PostgreSQL/SQLite
├─ Migrations required
├─ SQL queries
└─ Table schemas
```

**After (MongoDB):**

```
Mongoose → MongoDB Atlas
├─ No migrations needed
├─ Query builder
└─ Schema validation
```

### 4. Database Schema

**Collections:**

- `tenants` - Domain configurations
- `tenant_themes` - Theme settings per tenant

**Features:**

- Automatic timestamps (createdAt, updatedAt)
- Unique indexes on domain fields
- Connection pooling optimized for serverless

## Development Setup

### Local MongoDB

```bash
# macOS
brew services start mongodb-community

# Set environment
MONGODB_URI=mongodb://localhost:27017/chroma-dev

# Start dev server
npm run dev
```

### No Migrations Needed

MongoDB creates collections automatically on first insert.

## Production Deployment

### Vercel with MongoDB Atlas

> **Security:** Never commit real Atlas credentials. Put the connection string in the `MONGODB_URI` environment variable (e.g. Vercel/Atlas integration or `.env.local`), not in source control.


1. **Create MongoDB Atlas Database:**
   - Vercel Dashboard → Storage → Create Database
   - Select **MongoDB Atlas** (not Postgres or Blob)
   - Choose Free tier
   - Connect to project

2. **Environment Variables:**
   - `MONGODB_URI` is automatically set by Vercel
   - Format: `mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

No migration scripts needed - MongoDB is ready to use immediately.

## Benefits of MongoDB

1. ✅ **No migrations** - Schema-less, flexible data model
2. ✅ **Vercel integration** - Official MongoDB Atlas support
3. ✅ **JSON native** - Perfect for theme configurations
4. ✅ **Serverless friendly** - Built-in connection pooling
5. ✅ **Scalability** - Easy horizontal scaling

## Type Safety

TypeScript types are maintained through:

- Mongoose schema inference
- Custom type definitions
- Type assertions where needed

```typescript
export type TenantDocument = mongoose.InferSchemaType<typeof tenantSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
```

## API Compatibility

All existing API routes work without changes:

- ✅ `GET /api/theme/[domain]`
- ✅ `POST /api/theme/[domain]`
- ✅ `POST /api/admin/theme`
- ✅ `DELETE /api/admin/theme`

## Testing

All tests pass:

- ✅ TypeScript compilation (`npm run type-check`)
- ✅ ESLint (`npm run lint`)
- ✅ Production build (`npm run build`)

## Clean Up (Optional)

You can now remove unused dependencies:

```bash
npm uninstall drizzle-orm drizzle-kit better-sqlite3 postgres pg @types/better-sqlite3 @types/pg
```

Delete unused files:

```bash
rm -rf drizzle/ drizzle-pg/
rm src/lib/schema.ts src/lib/schema-pg.ts
rm drizzle.config.ts drizzle.config.pg.ts
rm scripts/migrate.js
```

## Rollback (If Needed)

If you need to rollback to PostgreSQL:

1. Restore the git commit before migration
2. Reinstall Drizzle and PostgreSQL packages
3. Update environment variables

## Support

- MongoDB docs: https://www.mongodb.com/docs/
- Mongoose docs: https://mongoosejs.com/docs/
- Vercel MongoDB: https://vercel.com/docs/storage/vercel-mongodb

## Next Steps

1. ✅ Connect MongoDB Atlas in Vercel
2. ✅ Deploy to production
3. ✅ Test tenant creation
4. 🔄 Monitor performance
5. 🔄 Add indexes if needed for performance
