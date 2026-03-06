'use server'

import { createTask, getAllTasks } from '@/modules/tasks/tasks-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function GET() {
  try {
    const data = await getAllTasks()
    
    return ApiResponse.ok('Tasks fetched successfully', data)
  } catch (error) {
    const apiError =
      error?.name === 'ApiError' ? error : ApiError.server('Failed to fetch tasks')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const data = await createTask(body)

    return ApiResponse.created('Task created successfully', data)
  } catch (error) {
    const apiError =
      error?.name === 'ApiError' ? error : ApiError.server('Failed to create task')
    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
}


