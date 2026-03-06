CREATE TYPE "public"."badge_condition_type" AS ENUM('streak_days', 'total_hours', 'tasks_completed', 'sessions_count', 'diary_streak', 'first_action', 'donation_made');--> statement-breakpoint
CREATE TYPE "public"."record_source" AS ENUM('timer', 'manual');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."timer_type" AS ENUM('pomodoro', 'stopwatch', 'timer', 'countdown', 'custom');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended', 'banned');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"color" varchar(30) DEFAULT 'bg-gray-500' NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stat_date" date DEFAULT CURRENT_DATE NOT NULL,
	"planned_sec" integer DEFAULT 0 NOT NULL,
	"tasks_planned" integer DEFAULT 0 NOT NULL,
	"recorded_sec" integer DEFAULT 0 NOT NULL,
	"tasks_completed" integer DEFAULT 0 NOT NULL,
	"total_sessions" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"diary_date" date NOT NULL,
	"bad_note" text,
	"good_note" text,
	"next_note" text,
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
	"timer_session_id" uuid,
	"daily_stat_id" uuid,
	"record_date" date NOT NULL,
	"planned_sec" integer DEFAULT 0 NOT NULL,
	"total_sec" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"record_source" "record_source" DEFAULT 'timer' NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"start_at" time DEFAULT '05:00:00' NOT NULL,
	"end_at" time DEFAULT '06:00:00' NOT NULL,
	"target_sec" integer DEFAULT 3600 NOT NULL,
	"color" varchar(30) DEFAULT 'bg-purple-600' NOT NULL,
	"is_everyday" boolean DEFAULT true NOT NULL,
	"repeat_days" text[],
	"status" "status" DEFAULT 'active',
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
	"end_time" time,
	"duration_sec" integer,
	"paused_duration_sec" integer DEFAULT 0 NOT NULL,
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
	"status" "user_status" DEFAULT 'active',
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_statistics" ADD CONSTRAINT "daily_statistics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_records" ADD CONSTRAINT "task_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_records" ADD CONSTRAINT "task_records_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_records" ADD CONSTRAINT "task_records_timer_session_id_timer_sessions_id_fk" FOREIGN KEY ("timer_session_id") REFERENCES "public"."timer_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_records" ADD CONSTRAINT "task_records_daily_stat_id_daily_statistics_id_fk" FOREIGN KEY ("daily_stat_id") REFERENCES "public"."daily_statistics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timer_sessions" ADD CONSTRAINT "timer_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timer_sessions" ADD CONSTRAINT "timer_sessions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_user_title_uidx" ON "categories" USING btree ("user_id","title");--> statement-breakpoint
CREATE INDEX "categories_user_id_idx" ON "categories" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_statistics_user_date_uidx" ON "daily_statistics" USING btree ("user_id","stat_date");--> statement-breakpoint
CREATE INDEX "daily_statistics_user_id_idx" ON "daily_statistics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_statistics_stat_date_idx" ON "daily_statistics" USING btree ("stat_date");--> statement-breakpoint
CREATE UNIQUE INDEX "diaries_user_date_uidx" ON "diaries" USING btree ("user_id","diary_date");--> statement-breakpoint
CREATE INDEX "diaries_user_id_idx" ON "diaries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "events_user_date_idx" ON "events" USING btree ("user_id","event_date");--> statement-breakpoint
CREATE INDEX "events_user_id_idx" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "task_records_user_task_date_uidx" ON "task_records" USING btree ("user_id","task_id","record_date");--> statement-breakpoint
CREATE INDEX "task_records_user_id_idx" ON "task_records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "task_records_task_id_idx" ON "task_records" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_records_user_date_idx" ON "task_records" USING btree ("user_id","record_date");--> statement-breakpoint
CREATE INDEX "task_records_completed_date_idx" ON "task_records" USING btree ("user_id","record_date","is_completed");--> statement-breakpoint
CREATE UNIQUE INDEX "tasks_user_title_uidx" ON "tasks" USING btree ("user_id","title");--> statement-breakpoint
CREATE INDEX "tasks_user_id_idx" ON "tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tasks_category_id_idx" ON "tasks" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "tasks_user_status_idx" ON "tasks" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "timer_sessions_user_id_idx" ON "timer_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "timer_sessions_task_id_idx" ON "timer_sessions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "timer_sessions_user_date_idx" ON "timer_sessions" USING btree ("user_id","session_date");--> statement-breakpoint
CREATE INDEX "users_username_email_idx" ON "users" USING btree ("username","email");--> statement-breakpoint
CREATE INDEX "users_active_idx" ON "users" USING btree ("id") WHERE "users"."status" = 'active';