import { relations } from 'drizzle-orm'
import { index, pgTable, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'
import { tasks } from './tasks-schema'
import { users } from './users-schema'

export const categories = pgTable(
  'categories',
  {
    ...globalId,

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: varchar('title', { length: 255 }).notNull(),
    color: varchar('color', { length: 30 }).notNull().default('bg-gray-500'),

    ...globalTimestamps,
  },
  (t) => [
    uniqueIndex('categories_user_title_uidx').on(t.userId, t.title),
    index('categories_user_id_idx').on(t.userId),
  ],
)

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}))
