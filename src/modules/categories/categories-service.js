'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { categories } from '@/drizzle/schemas/categories-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  categoryListResponseDto,
  categoryResponseDto,
  createCategoryRequestDto,
  updateCategoryRequestDto,
} from './categories-dto'

export async function getAllCategories() {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(categories)
    const data = categoryListResponseDto.parse(rows)

    logger.info({
      action: 'categories:getAll',
      count: data.length,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'categories:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch categories')
  }
}

export async function getCategoriesById(id) {
  const startTime = Date.now()

  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) {
      throw ApiError.notFound('Category not found')
    }

    const data = categoryResponseDto.parse(row)

    logger.info({
      action: 'categories:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'categories:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch category')
  }
}

export async function createCategory(payload) {
  const startTime = Date.now()

  try {
    const validated = createCategoryRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db.insert(categories).values(validated).returning()
    const data = categoryResponseDto.parse(created)

    logger.info({
      action: 'categories:create',
      id: data.id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'categories:create',
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create category')
  }
}

export async function updateCategory(id, payload) {
  const startTime = Date.now()

  try {
    const validated = updateCategoryRequestDto.parse(payload)

    const [updated] = await db
      .update(categories)
      .set(validated)
      .where(eq(categories.id, id))
      .returning()

    if (!updated) {
      throw ApiError.notFound('Category not found')
    }

    const data = categoryResponseDto.parse(updated)

    logger.info({
      action: 'categories:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'categories:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update category')
  }
}

export async function deleteCategory(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Category not found')
    }

    logger.info({
      action: 'categories:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return deleted
  } catch (error) {
    logger.error({
      action: 'categories:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete category')
  }
}
