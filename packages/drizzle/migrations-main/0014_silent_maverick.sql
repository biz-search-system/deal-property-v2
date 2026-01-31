CREATE TABLE `master_options` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`value` text NOT NULL,
	`organization_id` text,
	`created_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `master_options_category_idx` ON `master_options` (`category`);--> statement-breakpoint
CREATE INDEX `master_options_org_idx` ON `master_options` (`organization_id`);--> statement-breakpoint
CREATE INDEX `master_options_category_org_idx` ON `master_options` (`category`,`organization_id`);