import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { users } from '@/drizzle/schemas/users-schema'
import { sessions } from '@/drizzle/schemas/auth-schema'

const insertUserSchema = createInsertSchema(users)
const selectSessionSchema = createSelectSchema(sessions)
const selectUserSchema = createSelectSchema(users)

export const registerRequestDto = insertUserSchema
  .pick({
    name: true,
    email: true,
    password: true,
  })
  .extend({
    email: z.email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })

export const loginRequestDto = z.object({
  email: z.email(),
  password: z.string().min(1, 'Password is required'),
})

export const sessionResponseDto = z.object({
  session: selectSessionSchema,
  user: selectUserSchema.omit({ password: true }),
})
