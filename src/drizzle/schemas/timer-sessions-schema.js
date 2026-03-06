import { date, index, integer, pgTable, time, uuid } from 'drizzle-orm/pg-core'
import { TimerTypeEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'

export const timerSessions = pgTable(
  'timer_sessions',
  {
    ...globalId,
    userId: uuid('user_id').notNull(),
    taskId: uuid('task_id').notNull(),

    // Mengikuti AppContext.records[date].sessions
    sessionDate: date('session_date').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    durationSec: integer('duration_sec').notNull(),

    timerType: TimerTypeEnum('timer_type').notNull().default('pomodoro'),

    ...globalTimestamps,
  },
  (t) => ({
    userDateIdx: index('timer_sessions_user_date_idx').on(
      t.userId,
      t.sessionDate,
    ),
    taskDateIdx: index('timer_sessions_task_date_idx').on(
      t.taskId,
      t.sessionDate,
    ),
  }),
)
