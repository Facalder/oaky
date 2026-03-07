import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { categories } from '@/drizzle/schemas/categories-schema'

const insertCategorySchema = createInsertSchema(categories)
const selectCategorySchema = createSelectSchema(categories)

export const createCategoryRequestDto = insertCategorySchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial({
    userId: true,
    color: true,
  })

export const updateCategoryRequestDto = insertCategorySchema
  .pick({
    title: true,
    color: true,
  })
  .partial()

export const categoryResponseDto = selectCategorySchema

export const categoryListResponseDto = z.array(categoryResponseDto)