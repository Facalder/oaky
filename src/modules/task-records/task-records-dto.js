import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { taskRecords } from '@/drizzle/schemas/task-records-schema'

const insertTaskRecordSchema = createInsertSchema(taskRecords)
const selectTaskRecordSchema = createSelectSchema(taskRecords)

export const createTaskRecordRequestDto = insertTaskRecordSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateTaskRecordRequestDto = insertTaskRecordSchema
  .pick({
    recordDate: true,
    timerSessionId: true,
    dailyStatId: true,
    plannedSec: true,
    totalSec: true,
    isCompleted: true,
    recordSource: true,
  })
  .partial()

export const taskRecordResponseDto = selectTaskRecordSchema

export const taskRecordListResponseDto = z.array(taskRecordResponseDto)
