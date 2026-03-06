import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { events } from '../schemas/events-schema'

const insertEventSchema = createInsertSchema(events)
const selectEventSchema = createSelectSchema(events)

export const createEventRequestDto = insertEventSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial({
    userId: true,
  })

export const updateEventRequestDto = insertEventSchema
  .pick({
    title: true,
    eventDate: true,
  })
  .partial()

export const eventResponseDto = selectEventSchema

export const eventListResponseDto = z.array(eventResponseDto)
