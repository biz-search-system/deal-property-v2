CREATE TABLE `master_options_new` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`value` text NOT NULL,
	`created_by` text REFERENCES users(id),
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);--> statement-breakpoint
INSERT INTO `master_options_new` (`id`, `category`, `value`, `created_by`, `created_at`, `updated_at`)
SELECT `id`, `category`, `value`, `created_by`, `created_at`, `updated_at` FROM `master_options`;--> statement-breakpoint
DROP TABLE `master_options`;--> statement-breakpoint
ALTER TABLE `master_options_new` RENAME TO `master_options`;--> statement-breakpoint
CREATE INDEX `master_options_category_idx` ON `master_options` (`category`);
