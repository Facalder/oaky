import { stopTimerSession } from '@/modules/timer-sessions/timer-sessions-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

/**
 * PATCH /api/timer-sessions/:id/stop
 *
 * Endpoint khusus untuk menghentikan sesi timer yang sedang berjalan.
 * Body: { endTime, durationSec, pausedDurationSec? }
 *
 * Setelah stop:
 *   - endTime + durationSec diisi di timerSessions.
 *   - TODO: service akan trigger upsert taskRecord + dailyStatistics.
 */
export async function PATCH(request, { params }) {
  const url = request.url
  const { id } = await params

  try {
    const payload = await request.json()
    const data = await stopTimerSession(id, payload, url)
    return ApiResponse.ok('Timer session stopped successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to stop timer session')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
