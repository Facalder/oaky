import { pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { StatusEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'

export const users = pgTable('users', {
  ...globalId,

  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  password: text('password').notNull(),

  status: StatusEnum

  ...globalTimestamps,
})
