import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/drizzle/index'
import { result } from '@/shared/config/env'

const db = drizzle(result.data?.DATABASE_URL || '', {
  logger: result.data?.NODE_ENV === 'development',
  schema,
})

export default db
