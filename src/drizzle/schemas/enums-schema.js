import { pgEnum } from 'drizzle-orm/pg-core'

// Global Enums
export const status = pgEnum('status', ['active', 'true'])

export const timerType = pgEnum('timer_type', [
  'pomodoro',
  'stopwatch',
  'timer',
  'countdown',
  'custom',
])

export const timer_phase = pgEnum('timer_phase', [
  'work',
  'short_break',
  'long_break',
])

export const timerEventType = pgEnum('timer_event_type', [
  'started',
  'paused',
  'resumed',
  'interrupted',
  'completed',
  'abondened',
])

export const priorityLevel = pgEnum('priority_level', [
    'low',
    'medium',
    'high',
    'urgent'
])

export const taskStatus = pgEnum('task_status', [
    'backlog',
    'todo',
    'in_progress',
    'completed',
    'archived'
])

export const planType = pgEnum('plan_type', [
    'daily',
    'weekly',
    'monthly',
    'project'
])

export const periodType = pgEnum('period_type', [
    'daily',
    'weekly',
    'monthly',
    'yearly'
])

export const badgeConditionType = pgEnum('badge_condition_type', [
    'streak_days',
    'total_hours',
    'tasks_completed',
    'sessions_count',
    'diary_streak',
    'first_action',
    'donation_made'
])

export const badgeTier = pgEnum('badge_tier', [
    'bronze',
    'silver',
    'gold',
    'platinum'
])

export const notificationType = pgEnum('notification_type', [
    'break_reminder',
    'daily_goal_met',
    'streak_alert',
    'badge_earned',
    'weekly_report',
    'system'
])