'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { events } from '@/drizzle/schemas/events-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createEventRequestDto,
  eventListResponseDto,
  eventResponseDto,
  updateEventRequestDto,
} from './events-dto'

export async function getAllEvents() {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(events)
    const data = eventListResponseDto.parse(rows)

    logger.info({
      action: 'events:getAll',
      count: data.length,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'events:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch events')
  }
}

export async function getEventsById(id) {
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

    logger.info({
      action: 'events:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'events:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch event')
  }
}

export async function createEvent(payload) {
  const startTime = Date.now()

  try {
    const validated = createEventRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db.insert(events).values(validated).returning()
    const data = eventResponseDto.parse(created)

    logger.info({
      action: 'events:create',
      id: data.id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'events:create',
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create event')
  }
}

export async function updateEvent(id, payload) {
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

    logger.info({
      action: 'events:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'events:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update event')
  }
}

export async function deleteEvent(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Event not found')
    }

    logger.info({
      action: 'events:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return deleted
  } catch (error) {
    logger.error({
      action: 'events:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete event')
  }
}
