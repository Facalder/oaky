import {
  deleteTask,
  getTaskById,
  updateTask,
} from '@/modules/tasks/tasks-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export async function GET(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params
  try {
    const data = await getTaskById(id, url)
    return ApiResponse.ok('Task fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch task')
    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function PATCH(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params
  try {
    const body = await request.json()
    const data = await updateTask(id, body, url)
    return ApiResponse.ok('Task updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update task')
    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function DELETE(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params
  try {
    await deleteTask(id, url)
    return ApiResponse.ok('Task deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete task')
    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
