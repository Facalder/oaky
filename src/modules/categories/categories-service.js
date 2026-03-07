'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { categories } from '@/drizzle/schemas/categories-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import { handleError } from '@/shared/utils/handle-error'
import {
  categoryListResponseDto,
  categoryResponseDto,
  createCategoryRequestDto,
  updateCategoryRequestDto,
} from './categories-dto'

export async function getAllCategories(urlEndpoint) {
  const startTime = Date.now()
  const action = 'categories:getAll'

  try {
    const rows = await db.select().from(categories)
    const data = categoryListResponseDto.parse(rows)

    logger.info('Categories fetched successfully', {
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

export async function getCategoryById(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'categories:getById'

  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1)

    const category = rows[0]

    if (!category) throw ApiError.notFound('Category not found')

    const data = categoryResponseDto.parse(category)

    logger.info('Category fetched successfully', {
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

export async function createCategory(payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'categories:create'

  try {
    const validated = createCategoryRequestDto.parse(payload)
    const [created] = await db.insert(categories).values(validated).returning()
    const data = categoryResponseDto.parse(created)

    logger.info('Category created successfully', {
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

export async function updateCategory(id, payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'categories:update'

  try {
    const validated = updateCategoryRequestDto.parse(payload)

    const [updated] = await db
      .update(categories)
      .set(validated)
      .where(eq(categories.id, id))
      .returning()

    if (!updated) throw ApiError.notFound('Category not found')

    const data = categoryResponseDto.parse(updated)

    logger.info('Category updated successfully', {
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

export async function deleteCategory(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'categories:delete'

  try {
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()

    if (!deleted) throw ApiError.notFound('Category not found')

    logger.info('Category deleted successfully', {
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
