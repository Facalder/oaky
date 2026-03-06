import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { users } from '../schemas/users-schema'

const insertUserSchema = createInsertSchema(users)
const selectUserSchema = createSelectSchema(users)

export const createUserRequestDto = insertUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateUserRequestDto = insertUserSchema
  .pick({
    username: true,
    name: true,
    email: true,
    password: true,
    status: true,
  })
  .partial()

export const userResponseDto = selectUserSchema

export const userListResponseDto = z.array(userResponseDto)

