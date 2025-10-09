import mongoose from 'mongoose'
import { env } from './env'

const MONGODB_URI = env.MONGODB_URI || 'mongodb://localhost:27017/chroma-dev'

if (!env.MONGODB_URI && env.NODE_ENV === 'production') {
  throw new Error('MONGODB_URI is required in production')
}

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

let cached: MongooseCache = global.mongooseCache

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts) as Promise<
      typeof mongoose
    >
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var mongooseCache: MongooseCache
}
