import { createDiary, getAllDiaries } from '@/modules/diaries/diaries-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function GET(request) {
  const url = request.url

  try {
    const data = await getAllDiaries(url)
    return ApiResponse.ok('Diaries fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch diaries')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function POST(request) {
  const url = request.url

  try {
    const payload = await request.json()
    const data = await createDiary(payload, url)
    return ApiResponse.created('Diary created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create diary')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
