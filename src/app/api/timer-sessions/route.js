import {
  createTimerSession,
  getAllTimerSessions,
} from '@/modules/timer-sessions/timer-sessions-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

/**
 * GET  /api/timer-sessions     → list semua timer sessions
 * POST /api/timer-sessions     → mulai (start) sesi timer baru
 *
 * Catatan flow dari schema:
 *   1. POST → buat sesi dengan startTime, sessionDate, taskId, timerType.
 *      endTime & durationSec masih null (sesi sedang berjalan).
 *   2. PATCH /api/timer-sessions/:id/stop → isi endTime + durationSec
 *      saat timer dihentikan → trigger upsert taskRecord + dailyStatistics.
 */
export async function GET(request) {
  const url = request.url

  try {
    const data = await getAllTimerSessions(url)
    return ApiResponse.ok('Timer sessions fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch timer sessions')

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
    const data = await createTimerSession(payload, url)
    return ApiResponse.created('Timer session started successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to start timer session')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
