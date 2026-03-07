import { ApiError } from '@/shared/errors/api-error'
import { apiClient } from '../api-client'

const RESOURCE_PATH = '/tasks'

export async function fetchAllTasks(queryParams = {}) {
  try {
    const allowedKeys = ['categoryId', 'status', 'isCompleted', 'isUpcoming']
    const searchParams = new URLSearchParams(
      Object.entries(queryParams).filter(
        ([key, value]) => allowedKeys.includes(key) && value != null,
      ),
    )

    const query = searchParams.toString()
    const endpoint = query ? `${RESOURCE_PATH}?${query}` : RESOURCE_PATH

    return await apiClient(endpoint, { method: 'GET' })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to fetch tasks')
  }
}

export async function fetchTaskById(id) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}`, { method: 'GET' })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to fetch task')
  }
}

export async function createTask(payload) {
  try {
    return await apiClient(RESOURCE_PATH, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to create task')
  }
}

export async function updateTask(id, payload) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to update task')
  }
}

export async function deleteTask(id) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to delete task')
  }
}

export async function toggleTaskCompletion(id) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}/toggle-completion`, {
      method: 'PATCH',
    })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to toggle task completion')
  }
}
