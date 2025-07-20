CREATE TABLE "experiments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hypothesis_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"start_date" date,
	"end_date" date,
	"daily_traffic" integer,
	"sample_size" integer,
	"confidence_level" integer DEFAULT 95,
	"statistical_power" integer DEFAULT 80,
	"variants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(50) DEFAULT 'planning' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hypotheses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"intervention" text NOT NULL,
	"target_audience" text NOT NULL,
	"expected_outcome" text NOT NULL,
	"reasoning" text NOT NULL,
	"success_metrics" jsonb NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hypothesis_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hypothesis_id" uuid NOT NULL,
	"scored_by" uuid,
	"overall_score" numeric(3, 1) NOT NULL,
	"clarity_score" numeric(3, 1) NOT NULL,
	"measurability_score" numeric(3, 1) NOT NULL,
	"reasoning_score" numeric(3, 1) NOT NULL,
	"scope_score" numeric(3, 1) NOT NULL,
	"testability_score" numeric(3, 1) NOT NULL,
	"ai_feedback" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ai_provider" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"workspace_id" uuid,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_hypothesis_id_hypotheses_id_fk" FOREIGN KEY ("hypothesis_id") REFERENCES "public"."hypotheses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hypotheses" ADD CONSTRAINT "hypotheses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hypotheses" ADD CONSTRAINT "hypotheses_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hypothesis_scores" ADD CONSTRAINT "hypothesis_scores_hypothesis_id_hypotheses_id_fk" FOREIGN KEY ("hypothesis_id") REFERENCES "public"."hypotheses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hypothesis_scores" ADD CONSTRAINT "hypothesis_scores_scored_by_users_id_fk" FOREIGN KEY ("scored_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE set null ON UPDATE no action;