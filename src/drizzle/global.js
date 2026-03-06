import { uuid } from 'drizzle-orm/pg-core'

export const globalId = {
  id: uuid('id').primaryKey().defaultRandom(),
}

export const globalTimestamps = {
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .$onUpdateFn(() => new Date()),
}
