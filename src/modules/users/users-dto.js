import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { users } from '@/drizzle/schemas/users-schema'

const insertUserSchema = createInsertSchema(users)
const selectUserSchema = createSelectSchema(users)

export const createUserRequestDto = insertUserSchema
  .omit({
    id: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    email: z.email(),
    password: z.string().min(8),
  })

export const updateUserRequestDto = insertUserSchema
  .pick({
    name: true,
    email: true,
    password: true,
    status: true,
  })
  .extend({
    email: z.email(),
    password: z.string().min(8),
  })
  .partial()

export const userResponseDto = selectUserSchema

export const userListResponseDto = z.array(userResponseDto)
