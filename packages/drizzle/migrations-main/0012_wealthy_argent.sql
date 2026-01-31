ALTER TABLE `settlement_progress` ADD `bc_settlement_status_at` integer;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `bc_settlement_status_by` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `ab_settlement_status_at` integer;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `ab_settlement_status_by` text REFERENCES users(id);