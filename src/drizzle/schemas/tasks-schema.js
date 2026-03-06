import { sql } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  text,
  time,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { StatusEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'

export const tasks = pgTable(
  'tasks',
  {
    ...globalId,
    userId: uuid('user_id').notNull(),

    // Sesuai alur data UI (AppContext): `task.category` adalah string
    category: varchar('category', { length: 50 }).notNull(),

    title: varchar('title', { length: 255 }).notNull(),
    startAt: time('start_at').notNull().default('05:00:00'),
    endAt: time('end_at').notNull().default('06:00:00'),
    color: varchar('color', { length: 30 }).notNull().default('bg-purple-600'),

    repeatEveryday: boolean('repeat_everyday').notNull().default(true),
    repeatDays: text('repeat_days').array().default(sql`ARRAY[]::text[]`),

    // UI butuh toggle completion
    isCompleted: boolean('is_completed').notNull().default(false),

    status: StatusEnum('status').notNull().default('active'),

    ...globalTimestamps,
  },
  (t) => ({
    userTitleUnique: uniqueIndex('tasks_user_title_unique').on(
      t.userId,
      t.title,
    ),
  }),
)
