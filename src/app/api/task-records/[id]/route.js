import {
  deleteTaskRecord,
  getTaskRecordsById,
  updateTaskRecord,
} from '@/modules/task-records/task-records-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function GET(request, { params }) {
  const url = request.url
  const { id } = await params

  try {
    const data = await getTaskRecordsById(id, url)
    return ApiResponse.ok('Task record fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch task record')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function PATCH(request, { params }) {
  const url = request.url
  const { id } = await params

  try {
    const payload = await request.json()
    const data = await updateTaskRecord(id, payload, url)
    return ApiResponse.ok('Task record updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update task record')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function DELETE(request, { params }) {
  const url = request.url
  const { id } = await params

  try {
    await deleteTaskRecord(id, url)
    return ApiResponse.ok('Task record deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete task record')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
