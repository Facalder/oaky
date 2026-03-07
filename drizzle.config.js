import { result } from '@/shared/config/env'
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './src/drizzle/migrations',
  schema: './src/drizzle/index.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: result.data?.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
  casing: 'snake_case',
})
