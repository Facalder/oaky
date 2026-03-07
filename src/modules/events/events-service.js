'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { events } from '@/drizzle/schemas/events-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createEventRequestDto,
  eventListResponseDto,
  eventResponseDto,
  updateEventRequestDto,
} from './events-dto'

export async function getAllEvents(urlEndpoint) {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(events)
    const data = eventListResponseDto.parse(rows)

    logger.info('Events fetched successfully', {
      action: 'events:getAll',
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch events', {
      action: 'events:getAll',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch events')
  }
}

export async function getEventsById(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) {
      throw ApiError.notFound('Event not found')
    }

    const data = eventResponseDto.parse(row)

    logger.info('Event fetched successfully', {
      action: 'events:getById',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch event', {
      action: 'events:getById',
      endpoint: urlEndpoint,
      id,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch event')
  }
}

export async function createEvent(payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = createEventRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db.insert(events).values(validated).returning()
    const data = eventResponseDto.parse(created)

    logger.info('Event created successfully', {
      action: 'events:create',
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to create event', {
      action: 'events:create',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create event')
  }
}

export async function updateEvent(id, payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = updateEventRequestDto.parse(payload)

    const [updated] = await db
      .update(events)
      .set(validated)
      .where(eq(events.id, id))
      .returning()

    if (!updated) {
      throw ApiError.notFound('Event not found')
    }

    const data = eventResponseDto.parse(updated)

    logger.info('Event updated successfully', {
      action: 'events:update',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to update event', {
      action: 'events:update',
      endpoint: urlEndpoint,
      id,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update event')
  }
}

export async function deleteEvent(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Event not found')
    }

    logger.info('Event deleted successfully', {
      action: 'events:delete',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    logger.error('Failed to delete event', {
      action: 'events:delete',
      endpoint: urlEndpoint,
      id,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete event')
  }
}
