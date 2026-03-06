import { relations } from 'drizzle-orm'
import {
  date,
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'
import { users } from './users-schema'

export const diaries = pgTable(
  'diaries',
  {
    ...globalId,

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    diaryDate: date('diary_date').notNull(),
    badNote: text('bad_note'),
    goodNote: text('good_note'),
    nextNote: text('next_note'),

    ...globalTimestamps,
  },
  (t) => [
    uniqueIndex('diaries_user_date_uidx').on(t.userId, t.diaryDate),
    index('diaries_user_id_idx').on(t.userId),
  ],
)

export const diariesRelations = relations(diaries, ({ one }) => ({
  user: one(users, {
    fields: [diaries.userId],
    references: [users.id],
  }),
}))