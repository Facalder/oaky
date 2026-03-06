import { pgEnum } from "drizzle-orm/pg-core"
import { enumToPgEnum } from "../utils/enum"

export const Status = {
  ACTIVE: 'active',
  TRUE: 'true',
}

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
}

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
}

export const TimerType = {
  POMODORO: 'pomodoro',
  STOPWATCH: 'stopwatch',
  TIMER: 'timer',
  COUNTDOWN: 'countdown',
  CUSTOM: 'custom',
}

export const BadgeConditionType = {
  STREAK_DAYS: 'streak_days',
  TOTAL_HOURS: 'total_hours',
  TASKS_COMPLETED: 'tasks_completed',
  SESSIONS_COUNT: 'sessions_count',
  DIARY_STREAK: 'diary_streak',
  FIRST_ACTION: 'first_action',
  DONATION_MADE: 'donation_made',
}

export const StatusEnum = pgEnum('status', enumToPgEnum(Status))

export const UserStatusEnum = pgEnum(
  'user_status',
  enumToPgEnum(UserStatus)
)

export const UserRoleEnum = pgEnum(
  'user_role',
  enumToPgEnum(UserRole)
)

export const TimerTypeEnum = pgEnum(
  'timer_type',
  enumToPgEnum(TimerType)
)

export const BadgeConditionTypeEnum = pgEnum(
  'badge_condition_type',
  enumToPgEnum(BadgeConditionType)
)