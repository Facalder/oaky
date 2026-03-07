import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { diaries } from '@/drizzle/schemas/diaries-schema'

const insertDiarySchema = createInsertSchema(diaries)
const selectDiarySchema = createSelectSchema(diaries)

export const createDiaryRequestDto = insertDiarySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateDiaryRequestDto = insertDiarySchema
  .pick({
    diaryDate: true,
    badNote: true,
    goodNote: true,
    nextNote: true,
  })
  .partial()

export const diaryResponseDto = selectDiarySchema

export const diaryListResponseDto = z.array(diaryResponseDto)
