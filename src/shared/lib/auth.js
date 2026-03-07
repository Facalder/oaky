import { betterAuth } from 'better-auth/minimal'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import db from '@/db/db'
import * as schema from '@/drizzle/index'
import { result } from '../config/env'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema: {
      ...schema
    }
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
    }
  },
  advanced: {
    database: {
      generateId: false,
    },
    disableOriginCheck: true
  },
  basePath: '/api/auth',
  baseURL: process.env.BETTER_AUTH_URL
})

