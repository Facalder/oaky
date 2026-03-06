import { date, integer, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'

export const taskRecords = pgTable(
  'task_records',
  {
    ...globalId,
    userId: uuid('user_id').notNull(),
    taskId: uuid('task_id').notNull(),

    // agregasi harian per task (records[date].tasks[taskId])
    recordDate: date('record_date').notNull(),
    totalSec: integer('total_sec').notNull().default(0),

    ...globalTimestamps,
  },
  (t) => ({
    userTaskDateUnique: uniqueIndex('task_records_user_task_date_unique').on(
      t.userId,
      t.taskId,
      t.recordDate,
    ),
  }),
)
