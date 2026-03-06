import { relations } from 'drizzle-orm'
import { date, index, integer, pgTable, time, uuid } from 'drizzle-orm/pg-core'
import { TimerTypeEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'
import { taskRecords } from './task-records-schema'
import { tasks } from './tasks-schema'
import { users } from './users-schema'

export const timerSessions = pgTable(
  'timer_sessions',
  {
    ...globalId,

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),

    sessionDate: date('session_date').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time'),
    durationSec: integer('duration_sec'),
    pausedDurationSec: integer('paused_duration_sec').notNull().default(0),

    timerType: TimerTypeEnum('timer_type').notNull().default('pomodoro'),

    ...globalTimestamps,
  },
  (t) => [
    index('timer_sessions_user_id_idx').on(t.userId),
    index('timer_sessions_task_id_idx').on(t.taskId),
    index('timer_sessions_user_date_idx').on(t.userId, t.sessionDate),
  ],
)

export const timerSessionsRelations = relations(timerSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [timerSessions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [timerSessions.taskId],
    references: [tasks.id],
  }),
  taskRecords: many(taskRecords),
}))