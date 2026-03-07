import { createUser, getAllUsers } from '@/modules/users/users-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export async function GET(request) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const data = await getAllUsers(url)
    return ApiResponse.ok('Users fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch users')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function POST(request) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const payload = await request.json()
    const data = await createUser(payload, url)
    return ApiResponse.created('User created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create user')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
