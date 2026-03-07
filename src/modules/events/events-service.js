'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { events } from '@/drizzle/schemas/events-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import { handleError } from '@/shared/utils/handle-error'
import {
  createEventRequestDto,
  eventListResponseDto,
  eventResponseDto,
  updateEventRequestDto,
} from './events-dto'

export async function getAllEvents(urlEndpoint) {
  const startTime = Date.now()
  const action = 'events:getAll'

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(events)
    const data = eventListResponseDto.parse(rows)

    logger.info('Events fetched successfully', {
      action,
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}

export async function getEventById(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'events:getById'

  try {
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) throw ApiError.notFound('Event not found')

    const data = eventResponseDto.parse(row)

    logger.info('Event fetched successfully', {
      action,
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, id, startTime })
  }
}

export async function createEvent(payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'events:create'

  try {
    const validated = createEventRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db.insert(events).values(validated).returning()
    const data = eventResponseDto.parse(created)

    logger.info('Event created successfully', {
      action,
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}

export async function updateEvent(id, payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'events:update'

  try {
    const validated = updateEventRequestDto.parse(payload)

    const [updated] = await db
      .update(events)
      .set(validated)
      .where(eq(events.id, id))
      .returning()

    if (!updated) throw ApiError.notFound('Event not found')

    const data = eventResponseDto.parse(updated)

    logger.info('Event updated successfully', {
      action,
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, id, startTime })
  }
}

export async function deleteEvent(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'events:delete'

  try {
    const [deleted] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning()

    if (!deleted) throw ApiError.notFound('Event not found')

    logger.info('Event deleted successfully', {
      action,
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, id, startTime })
  }
}
