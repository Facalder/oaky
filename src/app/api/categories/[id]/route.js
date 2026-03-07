import {
  deleteCategory,
  getCategoriesById,
  updateCategory,
} from '@/modules/categories/categories-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'

export async function GET(request, { params }) {
  const url = request.url
  const { id } = await params

  try {
    const data = await getCategoriesById(id, url)
    return ApiResponse.ok('Category fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch category')

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
    const data = await updateCategory(id, payload, url)
    return ApiResponse.ok('Category updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update category')

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
    await deleteCategory(id, url)
    return ApiResponse.ok('Category deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete category')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
