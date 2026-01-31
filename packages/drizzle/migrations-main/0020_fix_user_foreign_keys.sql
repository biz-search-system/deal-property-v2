-- Fix foreign key constraints on user references to use SET NULL instead of CASCADE/NO ACTION
-- This allows users to be deleted while preserving related data

PRAGMA foreign_keys=OFF;--> statement-breakpoint

-- 1. Recreate properties table with SET NULL on user references
CREATE TABLE `properties_new` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
	`property_name` text NOT NULL,
	`room_number` text,
	`owner_name` text NOT NULL,
	`amount_a` real,
	`amount_exit` real,
	`commission` real,
	`profit` real,
	`bc_deposit` real,
	`contract_date_a` integer,
	`contract_date_a_updated_at` integer,
	`contract_date_a_updated_by` text REFERENCES users(id) ON DELETE SET NULL,
	`contract_date_bc` integer,
	`contract_date_bc_updated_at` integer,
	`contract_date_bc_updated_by` text REFERENCES users(id) ON DELETE SET NULL,
	`settlement_date` integer,
	`settlement_date_updated_at` integer,
	`settlement_date_updated_by` text REFERENCES users(id) ON DELETE SET NULL,
	`contract_type` text,
	`company_b` text,
	`broker_company` text,
	`buyer_company` text,
	`mortgage_bank` text,
	`list_type` text,
	`progress_status` text DEFAULT 'bc_before_confirmed' NOT NULL,
	`progress_status_updated_at` integer,
	`progress_status_updated_by` text REFERENCES users(id) ON DELETE SET NULL,
	`document_status` text DEFAULT 'waiting_request' NOT NULL,
	`document_status_updated_at` integer,
	`document_status_updated_by` text REFERENCES users(id) ON DELETE SET NULL,
	`notes` text,
	`account_company` text,
	`bank_account` text,
	`created_by` text REFERENCES users(id) ON DELETE SET NULL,
	`updated_by` text REFERENCES users(id) ON DELETE SET NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
INSERT INTO `properties_new` SELECT `id`, `organization_id`, `property_name`, `room_number`, `owner_name`, `amount_a`, `amount_exit`, `commission`, `profit`, `bc_deposit`, `contract_date_a`, `contract_date_a_updated_at`, `contract_date_a_updated_by`, `contract_date_bc`, `contract_date_bc_updated_at`, `contract_date_bc_updated_by`, `settlement_date`, `settlement_date_updated_at`, `settlement_date_updated_by`, `contract_type`, `company_b`, `broker_company`, `buyer_company`, `mortgage_bank`, `list_type`, `progress_status`, `progress_status_updated_at`, `progress_status_updated_by`, `document_status`, `document_status_updated_at`, `document_status_updated_by`, `notes`, `account_company`, `bank_account`, `created_by`, `updated_by`, `created_at`, `updated_at` FROM `properties`;--> statement-breakpoint
DROP TABLE `properties`;--> statement-breakpoint
ALTER TABLE `properties_new` RENAME TO `properties`;--> statement-breakpoint
CREATE INDEX `idx_properties_organization_id` ON `properties` (`organization_id`);--> statement-breakpoint
CREATE INDEX `idx_properties_progress_status` ON `properties` (`progress_status`);--> statement-breakpoint
CREATE INDEX `idx_properties_document_status` ON `properties` (`document_status`);--> statement-breakpoint
CREATE INDEX `idx_properties_settlement_date` ON `properties` (`settlement_date`);--> statement-breakpoint
CREATE INDEX `idx_properties_created_at` ON `properties` (`created_at`);--> statement-breakpoint

-- 2. Recreate property_staff table with SET NULL on user reference
CREATE TABLE `property_staff_new` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
	`user_id` text REFERENCES users(id) ON DELETE SET NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
INSERT INTO `property_staff_new` SELECT * FROM `property_staff`;--> statement-breakpoint
DROP TABLE `property_staff`;--> statement-breakpoint
ALTER TABLE `property_staff_new` RENAME TO `property_staff`;--> statement-breakpoint
CREATE INDEX `idx_property_staff_property_id` ON `property_staff` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_staff_user_id` ON `property_staff` (`user_id`);--> statement-breakpoint

PRAGMA foreign_keys=ON;
