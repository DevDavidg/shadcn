# Configuración de Base de Datos

## Desarrollo (SQLite)

Para desarrollo local, el sistema usa SQLite por defecto:

```bash
# Generar migraciones
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Migrar datos existentes del mock KV
npm run db:migrate-data

# Abrir Drizzle Studio
npm run db:studio
```

## Producción (PostgreSQL)

Para producción, configura la variable `DATABASE_URL` con tu conexión PostgreSQL:

```bash
# Generar migraciones para PostgreSQL
npm run db:generate:pg

# Ejecutar migraciones en producción
npm run db:migrate:pg

# Abrir Drizzle Studio para PostgreSQL
npm run db:studio:pg
```

## Variables de Entorno

### Desarrollo

```env
NODE_ENV=development
SQLITE_DATABASE_PATH=./database.sqlite
```

### Producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
```

## Comandos de Tenant

```bash
# Crear nuevo tenant
npm run tenant:create mi-empresa.example.com

# Listar todos los tenants
npm run tenant:list

# Eliminar tenant
npm run tenant:delete mi-empresa.example.com
```

## Migración de Datos

El sistema migra automáticamente entre SQLite y PostgreSQL según el entorno. Los datos se almacenan de forma compatible entre ambas bases de datos.
