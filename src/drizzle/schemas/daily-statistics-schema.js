import { date, integer, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'

export const dailyStatistics = pgTable(
  'daily_statistics',
  {
    ...globalId,
    userId: uuid('user_id').notNull(),

    statDate: date('stat_date').notNull().defaultNow(),

    // mengikuti `records[date].total` (detik)
    totalSec: integer('total_sec').notNull().default(0),
    totalSessions: integer('total_sessions').notNull().default(0),
    tasksCompleted: integer('tasks_completed').notNull().default(0),

    ...globalTimestamps,
  },
  (t) => ({
    userDateUnique: uniqueIndex('daily_statistics_user_date_unique').on(
      t.userId,
      t.statDate,
    ),
  }),
)
