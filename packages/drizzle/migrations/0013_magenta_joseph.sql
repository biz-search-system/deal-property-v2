ALTER TABLE `settlement_progress` ADD `management_cancel_scheduled_month` text;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `management_cancel_scheduled_month_at` integer;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `management_cancel_scheduled_month_by` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `management_cancel_requested_date` text;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `management_cancel_requested_date_at` integer;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `management_cancel_requested_date_by` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `management_cancel_completed_date` text;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `management_cancel_completed_date_at` integer;--> statement-breakpoint
ALTER TABLE `settlement_progress` ADD `management_cancel_completed_date_by` text REFERENCES users(id);