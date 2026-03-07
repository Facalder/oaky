import { sql } from 'drizzle-orm'
import { boolean, index, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { UserStatusEnum, UserRoleEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'

export const users = pgTable(
  'users',
  {
    ...globalId,

    username: varchar('username', { length: 10 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 320 }).notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    password: text('password').notNull(),
    image: text('image'),

    role: UserRoleEnum('role').default('user'),
    status: UserStatusEnum('status').default('active'),

    ...globalTimestamps,
  },
  (t) => [
    index('users_username_email_idx').on(t.username, t.email),
    index('users_active_idx').on(t.id).where(sql`${t.status} = 'active'`),
  ],
)
