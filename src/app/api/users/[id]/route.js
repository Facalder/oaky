import {
  deleteUser,
  getUserById,
  updateUser,
} from '@/modules/users/users-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export async function GET(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    const data = await getUserById(id, url)
    return ApiResponse.ok('User fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch user')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function PATCH(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    const payload = await request.json()
    const data = await updateUser(id, payload, url)
    return ApiResponse.ok('User updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update user')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function DELETE(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    await deleteUser(id, url)
    return ApiResponse.ok('User deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete user')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
