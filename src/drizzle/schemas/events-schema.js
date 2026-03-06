import { relations } from 'drizzle-orm'
import { date, index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'
import { users } from './users-schema'

export const events = pgTable(
  'events',
  {
    ...globalId,

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: varchar('title', { length: 255 }).notNull(),
    eventDate: date('event_date').notNull(),

    ...globalTimestamps,
  },
  (t) => [
    index('events_user_date_idx').on(t.userId, t.eventDate),
    index('events_user_id_idx').on(t.userId),
  ],
)

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}))