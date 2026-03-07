import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { dailyStatistics } from '@/drizzle/schemas/daily-statistics-schema.js'

const insertDailyStatisticSchema = createInsertSchema(dailyStatistics)
const selectDailyStatisticSchema = createSelectSchema(dailyStatistics)

export const createDailyStatisticRequestDto = insertDailyStatisticSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateDailyStatisticRequestDto = insertDailyStatisticSchema
  .pick({
    statDate: true,
    plannedSec: true,
    tasksPlanned: true,
    recordedSec: true,
    tasksCompleted: true,
    totalSessions: true,
  })
  .partial()

export const dailyStatisticResponseDto = selectDailyStatisticSchema

export const dailyStatisticListResponseDto = z.array(dailyStatisticResponseDto)
