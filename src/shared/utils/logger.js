import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { result } from '@/shared/config/env'

const { combine, timestamp, printf, colorize, errors, splat } = winston.format

const logFormat = printf(
  ({ level, message, timestamp, stack, ...metadata }) => {
    const metaStr =
      Object.keys(metadata).length > 0 ? ` | ${JSON.stringify(metadata)}` : ''

    return `${timestamp} [${level}] : ${stack || message}${metaStr}`
  },
)

const transports = []

// Console log (development)
if (result.data?.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize(),
        splat(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat,
      ),
    }),
  )
}

// File logs (production & staging)
if (result.data?.NODE_ENV !== 'development') {
  transports.push(
    new DailyRotateFile({
      dirname: 'logs/app',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: combine(
        splat(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat,
      ),
    }),
  )

  transports.push(
    new DailyRotateFile({
      dirname: 'logs/error',
      filename: 'errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: combine(
        splat(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat,
      ),
    }),
  )
}

export const logger = winston.createLogger({
  level: result.data?.LOG_LEVEL || 'info',
  format: combine(
    splat(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports,
  exitOnError: false,
})
