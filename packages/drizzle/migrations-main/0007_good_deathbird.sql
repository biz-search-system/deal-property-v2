ALTER TABLE `properties` ADD `contract_date_a_updated_at` integer;--> statement-breakpoint
ALTER TABLE `properties` ADD `contract_date_a_updated_by` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `properties` ADD `contract_date_bc_updated_at` integer;--> statement-breakpoint
ALTER TABLE `properties` ADD `contract_date_bc_updated_by` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `properties` ADD `settlement_date_updated_at` integer;--> statement-breakpoint
ALTER TABLE `properties` ADD `settlement_date_updated_by` text REFERENCES users(id);