import { text } from 'drizzle-orm/gel-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { globalId, globalTimestamps } from '../global'

export const diaries = pgTable('diaries', {
  ...globalId,

  badNote: text('bad_note'),
  goodNote: text('good_note'),
  nextNote: text('next_note'),

  ...globalTimestamps
})
