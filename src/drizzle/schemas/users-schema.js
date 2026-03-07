import { sql } from 'drizzle-orm'
import { index, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { UserStatusEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'

export const users = pgTable(
  'users',
  {
    ...globalId,

    username: varchar('username', { length: 10 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 320 }).notNull().unique(),
    password: text('password').notNull(),

    status: UserStatusEnum('status').default('active'),

    ...globalTimestamps,
  },
  (t) => [
    index('users_username_email_idx').on(t.username, t.email),
    index('users_active_idx').on(t.id).where(sql`${t.status} = 'active'`),
  ],
)
