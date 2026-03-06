import { drizzle } from 'drizzle-orm/neon-http'
import { result } from '@/shared/config/env'

const db = drizzle(result.data?.DATABASE_URL || '', {
  logger: result.data?.NODE_ENV === 'development',
})

export default db
