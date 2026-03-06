CREATE TYPE "public"."badge_condition_type" AS ENUM('streak_days', 'total_hours', 'tasks_completed', 'sessions_count', 'diary_streak', 'first_action', 'donation_made');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."timer_type" AS ENUM('pomodoro', 'stopwatch', 'timer', 'countdown', 'custom');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended', 'banned');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stat_date" date DEFAULT now() NOT NULL,
	"total_sec" integer DEFAULT 0 NOT NULL,
	"total_sessions" integer DEFAULT 0 NOT NULL,
	"tasks_completed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"diary_date" date NOT NULL,
	"bad" text,
	"good" text,
	"next" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"event_date" date NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"record_date" date NOT NULL,
	"total_sec" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"start_at" time DEFAULT '05:00:00' NOT NULL,
	"end_at" time DEFAULT '06:00:00' NOT NULL,
	"color" varchar(30) DEFAULT 'bg-purple-600' NOT NULL,
	"repeat_everyday" boolean DEFAULT true NOT NULL,
	"repeat_days" text[] DEFAULT ARRAY[]::text[],
	"is_completed" boolean DEFAULT false NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timer_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"session_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"duration_sec" integer NOT NULL,
	"timer_type" timer_type DEFAULT 'pomodoro' NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(320) NOT NULL,
	"password" text NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "categories_user_title_unique" ON "categories" USING btree ("user_id","title");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_statistics_user_date_unique" ON "daily_statistics" USING btree ("user_id","stat_date");--> statement-breakpoint
CREATE UNIQUE INDEX "diaries_user_date_unique" ON "diaries" USING btree ("user_id","diary_date");--> statement-breakpoint
CREATE INDEX "events_user_date_idx" ON "events" USING btree ("user_id","event_date");--> statement-breakpoint
CREATE UNIQUE INDEX "task_records_user_task_date_unique" ON "task_records" USING btree ("user_id","task_id","record_date");--> statement-breakpoint
CREATE UNIQUE INDEX "tasks_user_title_unique" ON "tasks" USING btree ("user_id","title");--> statement-breakpoint
CREATE INDEX "timer_sessions_user_date_idx" ON "timer_sessions" USING btree ("user_id","session_date");--> statement-breakpoint
CREATE INDEX "timer_sessions_task_date_idx" ON "timer_sessions" USING btree ("task_id","session_date");