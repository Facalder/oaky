import { date, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'

export const diaries = pgTable(
  'diaries',
  {
    ...globalId,

    userId: uuid('user_id').notNull(),
    diaryDate: date('diary_date').notNull(),

    // Sesuai AppContext: { bad, good, next }
    bad: text('bad'),
    good: text('good'),
    next: text('next'),

    ...globalTimestamps,
  },
  (t) => ({
    userDateUnique: uniqueIndex('diaries_user_date_unique').on(
      t.userId,
      t.diaryDate,
    ),
  }),
)
