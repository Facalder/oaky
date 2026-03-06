import { date, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { globalId, globalTimestamps } from "../global";

export const dailyStatistics = pgTable('daily_statistics', {
    ...globalId,
    userId: uuid('user_id').notNull(),

    statDate: date('state_date').defaultNow(),
    totalFocusMin: integer('total_focus_min').default(0),
    totalSessions: integer('total_sessions').default(0),
    tasksCompleted: integer('total_tasks_Completed').default(0),

    ...globalTimestamps
})