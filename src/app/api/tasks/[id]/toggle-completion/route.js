import { toggleTaskCompletion } from '@/modules/tasks/tasks-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function PATCH(request, { params }) {
  const url = request.url
  const { id } = await params

  try {
    const data = await toggleTaskCompletion(id, url)
    return ApiResponse.ok('Task completion toggled successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to toggle task completion')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
