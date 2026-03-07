import 'dotenv/config'
import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  DATABASE_URL: z.url(),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),

  NEXT_PUBLIC_API_BASE_URL: z.url('Invalid URL'),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'Secret must be at least 32 characters'),
  BETTER_AUTH_URL: z.url('Invalid URL'),
})

export const result = envSchema?.safeParse(process.env)

if (!result.success) {
  console.error('❌ Invalid environment configuration')
  console.error(z.prettifyError(result.error))
  process.exit(1)
}
