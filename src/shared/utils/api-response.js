import { NextResponse } from 'next/server'
import { STATUS_CODES } from '@/shared/constants/status-code'

export class ApiResponse {
  constructor({ success, message, statusCode, data = null, errors }) {
    this.success = success
    this.message = message
    this.statusCode = statusCode
    this.data = data
    this.errors = errors
  }

  send() {
    return NextResponse.json(
      {
        success: this.success,
        message: this.message,
        statusCode: this.statusCode,
        ...(this.data !== undefined && { data: this.data }),
        ...(this.errors !== undefined && { errors: this.errors }),
      },
      { status: this.statusCode },
    )
  }

  static Success(message, data, statusCode = STATUS_CODES.OK) {
    return new ApiResponse({ success: true, message, data, statusCode }).send()
  }

  static ok(message = 'OK', data) {
    return ApiResponse.Success(message, data, STATUS_CODES.OK)
  }

  static created(message = 'Created', data) {
    return ApiResponse.Success(message, data, STATUS_CODES.CREATED)
  }

  static error(
    message,
    statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
    errors,
  ) {
    return new ApiResponse({
      success: false,
      message,
      statusCode,
      errors,
    }).send()
  }
}
