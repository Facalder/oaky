import { ApiError } from '@/shared/errors/api-error'

export async function parseResponse(res) {
  const json = await res.json()

  if (!res.ok || json.success === false) {
    throw new ApiError(
      json.statusCode || res.status,
      json.message || 'An error occurred during the request',
      json.errors
    )
  }

  return json.data
}

export async function apiClient(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
  const url = `${baseUrl}${endpoint}`
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers })
  return parseResponse(res)
}
