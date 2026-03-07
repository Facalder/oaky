'use server'

import { headers } from 'next/headers'
import { auth } from '@/shared/lib/auth'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import { handleError } from '@/shared/utils/handle-error'
import { registerRequestDto, loginRequestDto } from './auth-dto'

export async function getSession(urlEndpoint = 'auth:getSession') {
  const startTime = Date.now()
  const action = 'auth:getSession'

  try {
    const defaultHeaders = await headers()

    const session = await auth.api.getSession({
      headers: defaultHeaders,
    })

    if (session) {
      logger.info('Session fetched successfully', {
        action,
        endpoint: urlEndpoint,
        userId: session.user.id,
        duration: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString(),
      })
    }

    return session
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}

export async function registerUser(payload, urlEndpoint = 'auth:register') {
  const startTime = Date.now()
  const action = 'auth:register'

  try {
    const validated = registerRequestDto.parse(payload)
    const { name, email, password } = validated
    const defaultHeaders = await headers()

    const res = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: defaultHeaders,
    })

    if (!res || res.error) {
      throw ApiError.badRequest(
        res?.error?.message || 'Failed to create user data.',
      )
    }

    logger.info('User saved to db successfully', {
      action,
      endpoint: urlEndpoint,
      userId: res?.user?.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return res
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}

export async function loginUser(payload, urlEndpoint = 'auth:login') {
  const startTime = Date.now()
  const action = 'auth:login'

  try {
    const validated = loginRequestDto.parse(payload)
    const { email, password } = validated
    const defaultHeaders = await headers()

    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: defaultHeaders,
    })

    if (!res || res.error) {
      throw ApiError.unauthorized(res?.error?.message || 'Login failed')
    }

    logger.info('User logged in successfully', {
      action,
      endpoint: urlEndpoint,
      userId: res?.user?.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return res
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}

export async function logoutUser(urlEndpoint = 'auth:logout') {
  const startTime = Date.now()
  const action = 'auth:logout'

  try {
    const defaultHeaders = await headers()

    await auth.api.signOut({
      headers: defaultHeaders,
    })

    logger.info('User logged out successfully', {
      action,
      endpoint: urlEndpoint,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}
