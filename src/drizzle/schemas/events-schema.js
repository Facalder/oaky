import { date, index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'

// Mengikuti AppContext.events: { id, title, date }
export const events = pgTable(
  'events',
  {
    ...globalId,
    userId: uuid('user_id').notNull(),

    title: varchar('title', { length: 255 }).notNull(),
    eventDate: date('event_date').notNull(),

    ...globalTimestamps,
  },
  (t) => ({
    userDateIdx: index('events_user_date_idx').on(t.userId, t.eventDate),
  }),
)
