import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { auth } from '@/shared/lib/auth'

export function withAuth(handler) {
  return async function (request, context) {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    // DEBUG SEMENTARA — hapus setelah ketemu masalahnya
    console.log('SESSION:', JSON.stringify(session, null, 2))
    console.log('HEADERS:', Object.fromEntries(request.headers.entries()))

    if (!session?.user) {
      const error = ApiError.unauthorized('Missing or invalid authorization header')
      return ApiResponse.error(error.message, error.statusCode)
    }

    return handler(request, context, session.user.id)
  }
}