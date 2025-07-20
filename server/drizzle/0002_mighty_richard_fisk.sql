CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"avatar_url" text,
	"notifications" jsonb DEFAULT '{"email":{"marketingEmails":false,"productUpdates":true,"experimentResults":true,"weeklyDigest":true},"inApp":{"experimentUpdates":true,"collaborationActivity":true,"systemAlerts":true}}'::jsonb NOT NULL,
	"api_keys" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"theme" varchar(20) DEFAULT 'system' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;