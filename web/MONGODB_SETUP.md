# MongoDB Setup Guide

## Local Development

### 1. Install MongoDB

**macOS:**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Download and install from https://www.mongodb.com/try/download/community

### 2. Configure Environment

Create `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/chroma-dev
```

### 3. Start Development

```bash
npm run dev
```

MongoDB will automatically create the database and collections on first use.

## Production (Vercel with MongoDB Atlas)

### 1. Create MongoDB Atlas Database

In your Vercel project:

1. Go to **Storage** tab
2. Click **Create Database**
3. Select **MongoDB Atlas**
4. Choose:
   - Database Name: `chroma-dev`
   - Cluster Type: **Free** ($0)
   - Region: **Washington, D.C., USA (iad1)**
5. Click **Create & Continue**
6. Connect to your project

### 2. Environment Variables

Vercel automatically adds `MONGODB_URI` to your environment variables.

Format:

```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### 3. Deploy

```bash
vercel --prod
```

No migrations needed - MongoDB creates collections automatically.

## Database Schema

### Collections

**tenants**

```javascript
{
  _id: ObjectId,
  domain: String (unique, indexed),
  name: String,
  logo: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**tenant_themes**

```javascript
{
  _id: ObjectId,
  tenantDomain: String (unique, indexed),
  config: String (JSON),
  createdAt: Date,
  updatedAt: Date
}
```

## MongoDB vs SQL Migration

| SQL (Drizzle)       | MongoDB (Mongoose)          |
| ------------------- | --------------------------- |
| Tables              | Collections                 |
| Rows                | Documents                   |
| Migrations required | Schema-less (no migrations) |
| JOIN queries        | Embedded documents or refs  |
| Fixed schema        | Flexible schema             |

## Advantages of MongoDB for This App

1. **No migrations** - Schema changes don't require migrations
2. **Flexible theme configs** - JSON storage is native
3. **Vercel integration** - Official MongoDB Atlas integration
4. **Serverless-friendly** - No connection pooling issues
5. **Scalability** - Easy horizontal scaling

## Connection Pooling

The app uses Mongoose with connection caching optimized for serverless:

```typescript
let cached = global.mongoose

if (!cached.conn) {
  cached.promise = mongoose.connect(MONGODB_URI)
}
```

This ensures a single connection is reused across serverless function invocations.

## Troubleshooting

### Error: "MongooseServerSelectionError"

→ MongoDB is not running locally. Start it with `brew services start mongodb-community`

### Error: "MONGODB_URI is required in production"

→ MongoDB Atlas database not connected in Vercel. Follow Setup Steps above.

### Connection timeout

→ Check firewall settings or MongoDB Atlas IP whitelist (should be set to allow all IPs: 0.0.0.0/0)

## Migration from PostgreSQL/SQLite

If you had existing data:

1. Export data from old database
2. Transform to MongoDB documents
3. Import using `mongoimport` or Mongoose scripts

Example export script:

```bash
# Export tenants
psql -d your_db -c "COPY tenants TO '/tmp/tenants.csv' CSV HEADER"

# Import to MongoDB
mongoimport --db chroma-dev --collection tenants --type csv --headerline --file /tmp/tenants.csv
```
