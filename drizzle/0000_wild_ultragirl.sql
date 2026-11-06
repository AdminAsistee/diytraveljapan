CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ai_usage` (
	`user_id` text NOT NULL,
	`day` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`user_id`, `day`)
);
