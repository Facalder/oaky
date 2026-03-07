import {
  createCategory,
  getAllCategories,
} from '@/modules/categories/categories-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function GET(request) {
  const url = request.url

  try {
    const data = await getAllCategories(url)
    return ApiResponse.ok('Categories fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch categories')

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
    const data = await createCategory(payload, url)
    return ApiResponse.created('Category created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create category')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
