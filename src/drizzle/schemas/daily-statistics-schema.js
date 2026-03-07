import { relations, sql } from 'drizzle-orm'
import {
  date,
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'
import { taskRecords } from './task-records-schema'
import { users } from './users-schema'

/**
 * dailyStatistics — satu baris per (user, hari).
 *
 * Dua sisi utama sesuai UI (kolom PLAN vs RECORD):
 *
 * ── PLAN (dihitung saat task dibuat / diubah) ──────────────────────────────
 *   plannedSec    = SUM(task.targetSec) untuk semua task aktif pada statDate
 *   tasksPlanned  = COUNT(tasks aktif pada statDate)
 *
 * ── RECORD (dihitung saat timer selesai / taskRecord di-upsert) ───────────
 *   recordedSec      = SUM(taskRecords.totalSec)             WHERE recordDate = statDate
 *   tasksCompleted   = COUNT(taskRecords WHERE isCompleted = true AND recordDate = statDate)
 *   totalSessions    = COUNT(timerSessions WHERE sessionDate = statDate AND endTime IS NOT NULL)
 *
 * Kedua sisi di-upsert oleh service layer masing-masing:
 *   - upsertDailyPlan()   → dipanggil saat create/update/delete task
 *   - upsertDailyRecord() → dipanggil saat timer session selesai
 */
export const dailyStatistics = pgTable(
  'daily_statistics',
  {
    ...globalId,

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    statDate: date('stat_date').notNull().default(sql`CURRENT_DATE`),

    // ── PLAN ────────────────────────────────────────────────────────────────
    // Total detik yang direncanakan = SUM(task.targetSec) semua task aktif hari ini.
    // Contoh UI: "PLAN 2h 00m" = dua task masing-masing 1 jam.
    plannedSec: integer('planned_sec').notNull().default(0),

    // Jumlah task yang dijadwalkan aktif pada hari ini.
    tasksPlanned: integer('tasks_planned').notNull().default(0),

    // ── RECORD ──────────────────────────────────────────────────────────────
    // Total detik yang sudah benar-benar dikerjakan = SUM(taskRecords.totalSec).
    // Contoh UI: "RECORD 0h 00m" saat belum ada timer yang dijalankan.
    recordedSec: integer('recorded_sec').notNull().default(0),

    // Jumlah task yang sudah isCompleted = true pada hari ini.
    tasksCompleted: integer('tasks_completed').notNull().default(0),

    // Jumlah sesi timer yang sudah selesai (endTime IS NOT NULL) pada hari ini.
    totalSessions: integer('total_sessions').notNull().default(0),

    ...globalTimestamps,
  },
  (t) => [
    uniqueIndex('daily_statistics_user_date_uidx').on(t.userId, t.statDate),
    index('daily_statistics_user_id_idx').on(t.userId),
    index('daily_statistics_stat_date_idx').on(t.statDate),
  ],
)

export const dailyStatisticsRelations = relations(
  dailyStatistics,
  ({ one, many }) => ({
    user: one(users, {
      fields: [dailyStatistics.userId],
      references: [users.id],
    }),
    taskRecords: many(taskRecords),
  }),
)
