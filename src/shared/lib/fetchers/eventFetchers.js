import { ApiError } from '@/shared/errors/api-error'
import { apiClient } from '../api-client'

const RESOURCE_PATH = '/events'

export async function fetchAllEvents() {
  try {
    return await apiClient(RESOURCE_PATH, { method: 'GET' })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to fetch events')
  }
}

export async function fetchEventById(id) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}`, { method: 'GET' })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to fetch event')
  }
}

export async function createEvent(payload) {
  try {
    return await apiClient(RESOURCE_PATH, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to create event')
  }
}

export async function updateEventById(id, payload) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to update event')
  }
}

export async function deleteEventById(id) {
  try {
    return await apiClient(`${RESOURCE_PATH}/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw ApiError.server(error.message || 'Failed to delete event')
  }
}
