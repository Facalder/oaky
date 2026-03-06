import { date, pgTable, uuid } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'

export const taskRecords = pgTable('task_records', {
  ...globalId,
  userId: uuid('user_id').notNull(),
  taskId: uuid('task_id').notNull(),
  timerSessionsId: uuid('timer_sessions_id').notNull(),

  recorededDate: date('recorded_date').notNull(),

  ...globalTimestamps,
})
