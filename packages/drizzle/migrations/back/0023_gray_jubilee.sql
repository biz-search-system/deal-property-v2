ALTER TABLE `settlement_progress` ADD `test_column` text;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `test_column_at` integer;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `test_column_by` text REFERENCES users(id);