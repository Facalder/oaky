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

export async function getAllCategories(urlEndpoint) {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(categories)
    const data = categoryListResponseDto.parse(rows)

    logger.info('Categories fetched successfully', {
      action: 'categories:getAll',
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch categories', {
      action: 'categories:getAll',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch categories')
  }
}

export async function getCategoriesById(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1)

    const category = rows[0]

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    const data = categoryResponseDto.parse(category)

    logger.info('Category fetched successfully', {
      action: 'categories:getById',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch category', {
      action: 'categories:getById',
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
      : ApiError.server('Failed to fetch category')
  }
}

export async function createCategory(payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = createCategoryRequestDto.parse(payload)

    const [created] = await db.insert(categories).values(validated).returning()
    const data = categoryResponseDto.parse(created)

    logger.info('Category created successfully', {
      action: 'categories:create',
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to create category', {
      action: 'categories:create',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create category')
  }
}

export async function updateCategory(id, payload, urlEndpoint) {
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

    logger.info('Category updated successfully', {
      action: 'categories:update',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to update category', {
      action: 'categories:update',
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
      : ApiError.server('Failed to update category')
  }
}

export async function deleteCategory(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Category not found')
    }

    logger.info('Category deleted successfully', {
      action: 'categories:delete',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    logger.error('Failed to delete category', {
      action: 'categories:delete',
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
      : ApiError.server('Failed to delete category')
  }
}
