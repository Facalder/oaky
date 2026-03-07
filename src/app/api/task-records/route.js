import {
  createTaskRecord,
  getAllTaskRecords,
} from '@/modules/task-records/task-records-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

/**
 * GET  /api/task-records       → list semua task records
 * POST /api/task-records       → buat task record baru (atau upsert via service)
 *
 * Catatan flow:
 *   - Record bisa terbentuk dari timer (recordSource:'timer')
 *     atau manual (recordSource:'manual') oleh user.
 *   - Setelah upsert, service layer harus meng-update dailyStatistics.
 */
export async function GET(request) {
  const url = request.url

  try {
    const data = await getAllTaskRecords(url)
    return ApiResponse.ok('Task records fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch task records')

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
    const data = await createTaskRecord(payload, url)
    return ApiResponse.created('Task record created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create task record')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
