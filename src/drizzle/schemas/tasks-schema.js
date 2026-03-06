import {
  boolean,
  pgTable,
  text,
  time,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { StatusEnum } from '@/shared/constants/enums'
import { globalId, globalTimestamps } from '../global'

export const tasks = pgTable('tasks', {
  ...globalId,
  user_id: uuid().notNull(),
  category_id: uuid().notNull(),

  title: varchar('title', { length: 255 }).notNull().unique(),
  startAt: time('start_at').notNull().default('05:00:00'),
  color: varchar('color', { length: 30 }).notNull().default('bg-purple-600'),
  endAt: time('end_at').notNull().default('06:00:00'),

  isEveryday: boolean('is_everyday').default(true),
  repeatDays: text('repeat_days').array(),

  status: StatusEnum().default('active'),

  ...globalTimestamps,
})
