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
  advanced: {
    database: {
      generateId: false,
    },
    disableOriginCheck: true
  },
  // trustedOrigins: (request) => {
  //   const allowedOrigins = ["http://localhost:3000"];
    
  //   if (process.env.NODE_ENV === "production") {
  //     const origin = request.headers.get("origin") || "";
      
  //     // Allow production domain
  //     allowedOrigins.push("https://oaky.vercel.app");
      
  //     // Allow current Vercel deployment
  //     if (process.env.VERCEL_URL) {
  //       allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
  //     }
      
  //     // Allow any vercel preview deployment (dengan validasi)
  //     if (origin && origin.endsWith(".vercel.app")) {
  //       allowedOrigins.push(origin);
  //     }
  //   }
    
  //   return allowedOrigins;
  // },
  basePath: '/api/auth',
  baseURL: process.env.BETTER_AUTH_URL
})

