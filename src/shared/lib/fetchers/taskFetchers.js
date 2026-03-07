import { ApiError } from '@/shared/errors/api-error'
import { apiClient } from '../api-client'

const RESOURCE_PATH = '/tasks'

export async function fetchAllTasks(queryParams = {}) {
  try {
    const searchParams = new URLSearchParams()
  
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value)
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${RESOURCE_PATH}?${queryString}` : RESOURCE_PATH

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

export async function updateTaskById(id, payload) {
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

export async function deleteTaskById(id) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to delete task')
  }
}

export async function toggleTaskCompletionById(id) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}/toggle-completion`, { method: 'PATCH' })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to toggle task completion')
  }
}