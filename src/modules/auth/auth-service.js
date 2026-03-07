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

export async function register(payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'auth:register'

  try {
    const validated = registerRequestDto.parse(payload)

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1)

    if (existing[0]) throw ApiError.conflict('Email already registered')

    // Daftarkan user lewat better-auth
    await auth.api.signUpEmail({
      body: {
        name: validated.name,
        email: validated.email,
        password: validated.password,
      },
    })

    // Ambil user yang baru dibuat untuk response DTO
    const [created] = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1)

    const user = userResponseDto.parse(created)

    logger.info('User registered successfully', {
      action,
      endpoint: urlEndpoint,
      id: created.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return { user }
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}

export async function login(payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'auth:login'

  try {
    const validated = loginRequestDto.parse(payload)

    // Login lewat better-auth, response-nya sudah include token/session
    const result = await auth.api.signInEmail({
      body: {
        email: validated.email,
        password: validated.password,
      },
    })

    if (!result) throw ApiError.unauthorized('Invalid email or password')

    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1)

    const user = userResponseDto.parse(row)

    logger.info('User logged in successfully', {
      action,
      endpoint: urlEndpoint,
      id: row.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    // token dari better-auth session
    return { token: result.token, user }
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
