import { pgTable, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'

export const categories = pgTable(
  'categories',
  {
    ...globalId,

    userId: uuid('user_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),

    ...globalTimestamps,
  },
  (t) => ({
    userTitleUnique: uniqueIndex('categories_user_title_unique').on(
      t.userId,
      t.title,
    ),
  }),
)
