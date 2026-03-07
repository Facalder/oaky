import { createTask, getAllTasks } from '@/modules/tasks/tasks-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { withAuth } from '@/shared/middlewares/with-auth'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export const GET = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  try {
    const { searchParams } = new URL(url)
    const queryParams = Object.fromEntries(
      ['categoryId', 'status', 'isCompleted', 'isUpcoming']
        .map((key) => [key, searchParams.get(key)])
        .filter(([, v]) => v != null),
    )

    const data = await getAllTasks(url, queryParams, userId)
    return ApiResponse.ok('Tasks fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch tasks')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const POST = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  try {
    const body = await request.json()
    const data = await createTask(body, url, userId)
    return ApiResponse.created('Task created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create task')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})
