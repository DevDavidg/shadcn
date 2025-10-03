import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { env } from './env'
import * as schema from './schema'

const sqlite = new Database(env.SQLITE_DATABASE_PATH)
sqlite.pragma('journal_mode = WAL')
const db = drizzle(sqlite, { schema })

export { db }
