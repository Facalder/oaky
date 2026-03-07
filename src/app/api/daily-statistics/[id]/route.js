import {
  deleteDailyStatistic,
  getDailyStatisticsById,
  updateDailyStatistic,
} from '@/modules/daily-statistics/daily-statistics-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function GET(request, { params }) {
  const url = request.url
  const { id } = await params

  try {
    const data = await getDailyStatisticsById(id, url)
    return ApiResponse.ok('Daily statistic fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch daily statistic')

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
    const data = await updateDailyStatistic(id, payload, url)
    return ApiResponse.ok('Daily statistic updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update daily statistic')

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
    await deleteDailyStatistic(id, url)
    return ApiResponse.ok('Daily statistic deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete daily statistic')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
