'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { events } from '@/drizzle/schemas/events-schema'
import { STATUS_CODES } from '@/shared/constants/status-code'
import { ApiResponse } from '@/shared/utils/api-response'
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

    return ApiResponse.ok('Events fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'events:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch events')
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
      return ApiResponse.error('Event not found', STATUS_CODES.NOT_FOUND)
    }

    const data = eventResponseDto.parse(row)

    logger.info({
      action: 'events:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Event fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'events:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch event')
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

    return ApiResponse.created('Event created successfully', data)
  } catch (error) {
    logger.error({
      action: 'events:create',
      error,
      durationMs: Date.now() - startTime,
    })

    if (error?.name === 'ZodError') {
      return ApiResponse.error(
        'Validation failed',
        STATUS_CODES.BAD_REQUEST,
        error.errors,
      )
    }

    return ApiResponse.error('Failed to create event')
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
      return ApiResponse.error('Event not found', STATUS_CODES.NOT_FOUND)
    }

    const data = eventResponseDto.parse(updated)

    logger.info({
      action: 'events:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Event updated successfully', data)
  } catch (error) {
    logger.error({
      action: 'events:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })

    if (error?.name === 'ZodError') {
      return ApiResponse.error(
        'Validation failed',
        STATUS_CODES.BAD_REQUEST,
        error.errors,
      )
    }

    return ApiResponse.error('Failed to update event')
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
      return ApiResponse.error('Event not found', STATUS_CODES.NOT_FOUND)
    }

    logger.info({
      action: 'events:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Event deleted successfully')
  } catch (error) {
    logger.error({
      action: 'events:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to delete event')
  }
}
