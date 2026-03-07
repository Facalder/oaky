import {
  deleteUser,
  getUserById,
  updateUser,
} from '@/modules/users/users-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { withAuth } from '@/shared/middlewares/with-auth'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export const GET = withAuth(async function (request, { params }, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    const data = await getUserById(id, url, userId)
    return ApiResponse.ok('User fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch user')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const PATCH = withAuth(async function (request, { params }, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    const payload = await request.json()
    const data = await updateUser(id, payload, url, userId)
    return ApiResponse.ok('User updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update user')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const DELETE = withAuth(async function (request, { params }, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    await deleteUser(id, url, userId)
    return ApiResponse.ok('User deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete user')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})
