import { relations } from 'drizzle-orm'
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { RecordSourceEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'
import { dailyStatistics } from './daily-statistics-schema'
import { tasks } from './tasks-schema'
import { timerSessions } from './timer-sessions-schema'
import { users } from './users-schema'

/**
 * taskRecords — satu baris per (user, task, hari).
 *
 * Dua cara record bisa terbentuk (sesuai flowchart):
 *
 *  A) Dari TIMER (Stopwatch / Pomodoro):
 *     timerSessionId diisi → totalSec diambil dari durationSec sesi.
 *     recordSource = 'timer'
 *
 *  B) Dari MANUAL (Plans and Record → Add Record):
 *     User pilih task + pilih durasi → langsung simpan.
 *     timerSessionId = null, recordSource = 'manual'
 *
 * Setelah UPSERT taskRecord, service layer meng-upsert dailyStatistics:
 *   recordedSec    += totalSec
 *   tasksCompleted  = COUNT WHERE isCompleted = true
 *   totalSessions   = COUNT timerSessions selesai hari itu
 */
export const taskRecords = pgTable(
  'task_records',
  {
    ...globalId,

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),

    // Diisi jika record berasal dari timer session, null jika manual.
    timerSessionId: uuid('timer_session_id').references(
      () => timerSessions.id,
      { onDelete: 'set null' },
    ),

    // FK ke dailyStatistics untuk memudahkan aggregate query dari sisi statistics.
    dailyStatId: uuid('daily_stat_id').references(() => dailyStatistics.id, {
      onDelete: 'set null',
    }),

    recordDate: date('record_date').notNull(),

    // Snapshot targetSec dari task saat record dibuat.
    // Disimpan agar perubahan task di kemudian hari tidak mengubah data historis PLAN.
    plannedSec: integer('planned_sec').notNull().default(0),

    // Total detik yang sudah dikerjakan untuk task ini pada hari recordDate.
    // Di-increment via UPSERT setiap kali sesi timer selesai, atau langsung di-set saat manual.
    totalSec: integer('total_sec').notNull().default(0),

    // true jika totalSec >= plannedSec (task dianggap selesai hari ini).
    isCompleted: boolean('is_completed').notNull().default(false),

    // 'timer' = berasal dari sesi timer | 'manual' = diinput manual oleh user
    recordSource: RecordSourceEnum('record_source').notNull().default('timer'),

    ...globalTimestamps,
  },
  (t) => [
    // Satu record per (user, task, hari) — aman untuk UPSERT on conflict
    uniqueIndex('task_records_user_task_date_uidx').on(
      t.userId,
      t.taskId,
      t.recordDate,
    ),
    index('task_records_user_id_idx').on(t.userId),
    index('task_records_task_id_idx').on(t.taskId),
    index('task_records_user_date_idx').on(t.userId, t.recordDate),
    // Index untuk COUNT tasksCompleted yang efisien ke dailyStatistics
    index('task_records_completed_date_idx').on(
      t.userId,
      t.recordDate,
      t.isCompleted,
    ),
  ],
)

export const taskRecordsRelations = relations(taskRecords, ({ one }) => ({
  user: one(users, {
    fields: [taskRecords.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [taskRecords.taskId],
    references: [tasks.id],
  }),
  timerSession: one(timerSessions, {
    fields: [taskRecords.timerSessionId],
    references: [timerSessions.id],
  }),
  dailyStat: one(dailyStatistics, {
    fields: [taskRecords.dailyStatId],
    references: [dailyStatistics.id],
  }),
}))
