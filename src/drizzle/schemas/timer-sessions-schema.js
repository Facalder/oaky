import { boolean, pgTable, uuid } from 'drizzle-orm/pg-core'
import { TimerTypeEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'

export const timerSessions = pgTable('timer_sessions', {
  ...globalId,
  user_id: uuid().notNull(),
  task_id: uuid().notNull(),

  timerType: TimerTypeEnum().default('pomodoro'),
  isCompleted: boolean('is_completed').default(false),

  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  ...globalTimestamps,
})
