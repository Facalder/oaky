'use server'

import { deleteTask, getTasksById, updateTask } from '@/modules/tasks/tasks-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function GET(_request, { params }) {
  try {
    const { id } = params
    const data = await getTasksById(id)
    return ApiResponse.ok('Task fetched successfully', data)
  } catch (error) {
    const apiError =
      error?.name === 'ApiError' ? error : ApiError.server('Failed to fetch task')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const data = await updateTask(id, body)
    return ApiResponse.ok('Task updated successfully', data)
  } catch (error) {
    const apiError =
      error?.name === 'ApiError' ? error : ApiError.server('Failed to update task')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = params
    await deleteTask(id)
    return ApiResponse.ok('Task deleted successfully')
  } catch (error) {
    const apiError =
      error?.name === 'ApiError' ? error : ApiError.server('Failed to delete task')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
}


