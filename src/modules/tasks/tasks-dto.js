import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { tasks } from '@/drizzle/schemas/tasks-schema'

const insertTaskSchema = createInsertSchema(tasks)
const selectTaskSchema = createSelectSchema(tasks)

export const createTaskRequestDto = insertTaskSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial({
    userId: true,
    categoryId: true,
    status: true,
  })

export const updateTaskRequestDto = insertTaskSchema
  .pick({
    categoryId: true,
    title: true,
    startAt: true,
    endAt: true,
    color: true,
    isEveryday: true,
    repeatDays: true,
    status: true,
    isCompleted: true,
  })
  .partial()

export const taskResponseDto = selectTaskSchema

export const taskListResponseDto = z.array(taskResponseDto)
