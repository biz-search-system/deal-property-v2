ALTER TABLE `contract_progress` ADD `maisoku_distribution` text DEFAULT 'not_distributed' NOT NULL;--> statement-breakpoint
ALTER TABLE `contract_progress` ADD `maisoku_distribution_at` integer;--> statement-breakpoint
ALTER TABLE `contract_progress` ADD `maisoku_distribution_by` text REFERENCES users(id);