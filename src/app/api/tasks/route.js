'use server'

import { createTask, getAllTasks } from '@/modules/tasks/tasks-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function GET(request) {
  const url = request.url

  try {
    const data = await getAllTasks(url)

    return ApiResponse.ok('Tasks fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch tasks')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors
    )
  }
}

export async function POST(request) {
  const url = request.url

  try {
    const body = await request.json()
    const data = await createTask(body, url)

    return ApiResponse.created('Task created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create task')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors
    )
  }
}