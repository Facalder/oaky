import {
  deleteTaskRecord,
  getTaskRecordById,
  updateTaskRecord,
} from '@/modules/task-records/task-records-service'
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
    const data = await getTaskRecordById(id, url, userId)
    return ApiResponse.ok('Task record fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch task record')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const PATCH = withAuth(async function (request, { params }, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    const payload = await request.json()
    const data = await updateTaskRecord(id, payload, url, userId)
    return ApiResponse.ok('Task record updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update task record')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const DELETE = withAuth(async function (request, { params }, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    await deleteTaskRecord(id, url, userId)
    return ApiResponse.ok('Task record deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete task record')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})
