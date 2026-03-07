import {
  deleteTask,
  getTaskById,
  updateTask,
} from '@/modules/tasks/tasks-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { withAuth } from '@/shared/middlewares/with-auth'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export const GET = withAuth(async function (request, { params }, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params
  try {
    const data = await getTaskById(id, url, userId)
    return ApiResponse.ok('Task fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch task')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const PATCH = withAuth(async function (request, { params }, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params
  try {
    const body = await request.json()
    const data = await updateTask(id, body, url, userId)
    return ApiResponse.ok('Task updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update task')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const DELETE = withAuth(async function (request, { params }, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params
  try {
    await deleteTask(id, url, userId)
    return ApiResponse.ok('Task deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete task')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})
