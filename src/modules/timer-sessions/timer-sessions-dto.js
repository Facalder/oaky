import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { timerSessions } from '@/drizzle/schemas/timer-sessions-schema'

const insertTimerSessionSchema = createInsertSchema(timerSessions)
const selectTimerSessionSchema = createSelectSchema(timerSessions)

export const createTimerSessionRequestDto = insertTimerSessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateTimerSessionRequestDto = insertTimerSessionSchema
  .pick({
    sessionDate: true,
    startTime: true,
    endTime: true,
    durationSec: true,
    pausedDurationSec: true,
    timerType: true,
  })
  .partial()

export const timerSessionResponseDto = selectTimerSessionSchema

export const timerSessionListResponseDto = z.array(timerSessionResponseDto)
