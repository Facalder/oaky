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
    status: true,
    isCompleted: true,
  })

export const updateTaskRequestDto = insertTaskSchema
  .pick({
    category: true,
    title: true,
    startAt: true,
    endAt: true,
    color: true,
    repeatEveryday: true,
    repeatDays: true,
    isCompleted: true,
    status: true,
  })
  .partial()

export const taskResponseDto = selectTaskSchema

export const taskListResponseDto = z.array(taskResponseDto)

