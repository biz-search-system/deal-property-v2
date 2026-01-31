ALTER TABLE `properties` ADD `progress_status_updated_at` integer;--> statement-breakpoint
ALTER TABLE `properties` ADD `progress_status_updated_by` text REFERENCES users(id);