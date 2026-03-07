import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  time,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { StatusEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'
import { categories } from './categories-schema'
import { taskRecords } from './task-records-schema'
import { users } from './users-schema'

/**
 * tasks — definisi task milik user.
 *
 * Setiap kali task di-create / update / delete, service layer wajib
 * memanggil upsertDailyPlan() untuk menyinkronkan:
 *   dailyStatistics.plannedSec   = SUM(targetSec) task aktif hari itu
 *   dailyStatistics.tasksPlanned = COUNT task aktif hari itu
 *
 * targetSec = selisih endAt - startAt dalam detik, dihitung di service layer
 * dan disimpan langsung agar tidak perlu kalkulasi ulang tiap query.
 */
export const tasks = pgTable(
  'tasks',
  {
    ...globalId,

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),

    title: varchar('title', { length: 255 }).notNull(),
    startAt: time('start_at').notNull().default('05:00:00'),
    endAt: time('end_at').notNull().default('06:00:00'),

    // Durasi target dalam detik = endAt - startAt.
    // Disimpan agar: (1) query plan cepat tanpa kalkulasi time diff,
    // (2) taskRecord.plannedSec bisa snapshot nilai ini saat record dibuat.
    targetSec: integer('target_sec').notNull().default(3600),

    color: varchar('color', { length: 30 }).notNull().default('bg-purple-600'),

    isEveryday: boolean('is_everyday').notNull().default(true),

    // Diisi jika isEveryday = false. Contoh: ['mon', 'wed', 'fri']
    repeatDays: text('repeat_days').array(),

    status: StatusEnum('status').default('active'),

    ...globalTimestamps,
  },
  (t) => [
    uniqueIndex('tasks_user_title_uidx').on(t.userId, t.title),
    index('tasks_user_id_idx').on(t.userId),
    index('tasks_category_id_idx').on(t.categoryId),
    index('tasks_user_status_idx').on(t.userId, t.status),
  ],
)

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
  taskRecords: many(taskRecords),
}))
