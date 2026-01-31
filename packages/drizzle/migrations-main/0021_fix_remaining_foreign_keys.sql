-- Fix remaining foreign key constraints on user references to use SET NULL
PRAGMA foreign_keys=OFF;--> statement-breakpoint

-- 1. Recreate contract_progress table
CREATE TABLE `contract_progress_new` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
	`maisoku_distribution` text DEFAULT 'not_distributed' NOT NULL,
	`maisoku_distribution_at` integer,
	`maisoku_distribution_by` text REFERENCES users(id) ON DELETE SET NULL,
	`ab_contract_saved` integer DEFAULT false NOT NULL,
	`ab_contract_saved_at` integer,
	`ab_contract_saved_by` text REFERENCES users(id) ON DELETE SET NULL,
	`ab_authorization_saved` integer DEFAULT false NOT NULL,
	`ab_authorization_saved_at` integer,
	`ab_authorization_saved_by` text REFERENCES users(id) ON DELETE SET NULL,
	`ab_seller_id_saved` integer DEFAULT false NOT NULL,
	`ab_seller_id_saved_at` integer,
	`ab_seller_id_saved_by` text REFERENCES users(id) ON DELETE SET NULL,
	`bc_contract_created` integer DEFAULT false NOT NULL,
	`bc_contract_created_at` integer,
	`bc_contract_created_by` text REFERENCES users(id) ON DELETE SET NULL,
	`bc_description_created` integer DEFAULT false NOT NULL,
	`bc_description_created_at` integer,
	`bc_description_created_by` text REFERENCES users(id) ON DELETE SET NULL,
	`bc_contract_sent` integer DEFAULT false NOT NULL,
	`bc_contract_sent_at` integer,
	`bc_contract_sent_by` text REFERENCES users(id) ON DELETE SET NULL,
	`bc_description_sent` integer DEFAULT false NOT NULL,
	`bc_description_sent_at` integer,
	`bc_description_sent_by` text REFERENCES users(id) ON DELETE SET NULL,
	`bc_contract_cb_done` integer DEFAULT false NOT NULL,
	`bc_contract_cb_done_at` integer,
	`bc_contract_cb_done_by` text REFERENCES users(id) ON DELETE SET NULL,
	`bc_description_cb_done` integer DEFAULT false NOT NULL,
	`bc_description_cb_done_at` integer,
	`bc_description_cb_done_by` text REFERENCES users(id) ON DELETE SET NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
INSERT INTO `contract_progress_new` SELECT `id`, `property_id`, `maisoku_distribution`, `maisoku_distribution_at`, `maisoku_distribution_by`, `ab_contract_saved`, `ab_contract_saved_at`, `ab_contract_saved_by`, `ab_authorization_saved`, `ab_authorization_saved_at`, `ab_authorization_saved_by`, `ab_seller_id_saved`, `ab_seller_id_saved_at`, `ab_seller_id_saved_by`, `bc_contract_created`, `bc_contract_created_at`, `bc_contract_created_by`, `bc_description_created`, `bc_description_created_at`, `bc_description_created_by`, `bc_contract_sent`, `bc_contract_sent_at`, `bc_contract_sent_by`, `bc_description_sent`, `bc_description_sent_at`, `bc_description_sent_by`, `bc_contract_cb_done`, `bc_contract_cb_done_at`, `bc_contract_cb_done_by`, `bc_description_cb_done`, `bc_description_cb_done_at`, `bc_description_cb_done_by`, `created_at`, `updated_at` FROM `contract_progress`;--> statement-breakpoint
DROP TABLE `contract_progress`;--> statement-breakpoint
ALTER TABLE `contract_progress_new` RENAME TO `contract_progress`;--> statement-breakpoint
CREATE UNIQUE INDEX `uk_contract_progress_property_id` ON `contract_progress` (`property_id`);--> statement-breakpoint

-- 2. Recreate document_progress table
CREATE TABLE `document_progress_new` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
	`status` text DEFAULT 'waiting_request' NOT NULL,
	`updated_by` text REFERENCES users(id) ON DELETE SET NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
INSERT INTO `document_progress_new` SELECT * FROM `document_progress`;--> statement-breakpoint
DROP TABLE `document_progress`;--> statement-breakpoint
ALTER TABLE `document_progress_new` RENAME TO `document_progress`;--> statement-breakpoint
CREATE UNIQUE INDEX `uk_document_progress_property_id` ON `document_progress` (`property_id`);--> statement-breakpoint

-- 3. Recreate settlement_progress table
CREATE TABLE `settlement_progress_new` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
	`bc_settlement_status` text DEFAULT 'not_created' NOT NULL,
	`bc_settlement_status_at` integer,
	`bc_settlement_status_by` text REFERENCES users(id) ON DELETE SET NULL,
	`ab_settlement_status` text DEFAULT 'not_created' NOT NULL,
	`ab_settlement_status_at` integer,
	`ab_settlement_status_by` text REFERENCES users(id) ON DELETE SET NULL,
	`loan_calculation_saved` integer DEFAULT false NOT NULL,
	`loan_calculation_saved_at` integer,
	`loan_calculation_saved_by` text REFERENCES users(id) ON DELETE SET NULL,
	`lawyer_requested` integer DEFAULT false NOT NULL,
	`lawyer_requested_at` integer,
	`lawyer_requested_by` text REFERENCES users(id) ON DELETE SET NULL,
	`documents_shared` integer DEFAULT false NOT NULL,
	`documents_shared_at` integer,
	`documents_shared_by` text REFERENCES users(id) ON DELETE SET NULL,
	`management_cancel_scheduled_month` text,
	`management_cancel_scheduled_month_at` integer,
	`management_cancel_scheduled_month_by` text REFERENCES users(id) ON DELETE SET NULL,
	`management_cancel_requested_date` text,
	`management_cancel_requested_date_at` integer,
	`management_cancel_requested_date_by` text REFERENCES users(id) ON DELETE SET NULL,
	`management_cancel_completed_date` text,
	`management_cancel_completed_date_at` integer,
	`management_cancel_completed_date_by` text REFERENCES users(id) ON DELETE SET NULL,
	`identity_verification` text DEFAULT 'none' NOT NULL,
	`documents_complete` integer DEFAULT false NOT NULL,
	`documents_complete_at` integer,
	`documents_complete_by` text REFERENCES users(id) ON DELETE SET NULL,
	`mortgage_bank_status` text DEFAULT 'none' NOT NULL,
	`bank_documents_complete` integer DEFAULT false NOT NULL,
	`bank_documents_complete_at` integer,
	`bank_documents_complete_by` text REFERENCES users(id) ON DELETE SET NULL,
	`loan_saved` integer DEFAULT false NOT NULL,
	`loan_saved_at` integer,
	`loan_saved_by` text REFERENCES users(id) ON DELETE SET NULL,
	`seller_payment_done` integer DEFAULT false NOT NULL,
	`seller_payment_done_at` integer,
	`seller_payment_done_by` text REFERENCES users(id) ON DELETE SET NULL,
	`management_cancel` text DEFAULT 'none' NOT NULL,
	`guarantee_transfer` text DEFAULT 'none' NOT NULL,
	`key_status` text DEFAULT 'none' NOT NULL,
	`account_transfer` text DEFAULT 'none' NOT NULL,
	`ledger_entry` integer DEFAULT false NOT NULL,
	`ledger_entry_at` integer,
	`ledger_entry_by` text REFERENCES users(id) ON DELETE SET NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
INSERT INTO `settlement_progress_new` SELECT `id`, `property_id`, `bc_settlement_status`, `bc_settlement_status_at`, `bc_settlement_status_by`, `ab_settlement_status`, `ab_settlement_status_at`, `ab_settlement_status_by`, `loan_calculation_saved`, `loan_calculation_saved_at`, `loan_calculation_saved_by`, `lawyer_requested`, `lawyer_requested_at`, `lawyer_requested_by`, `documents_shared`, `documents_shared_at`, `documents_shared_by`, `management_cancel_scheduled_month`, `management_cancel_scheduled_month_at`, `management_cancel_scheduled_month_by`, `management_cancel_requested_date`, `management_cancel_requested_date_at`, `management_cancel_requested_date_by`, `management_cancel_completed_date`, `management_cancel_completed_date_at`, `management_cancel_completed_date_by`, `identity_verification`, `documents_complete`, `documents_complete_at`, `documents_complete_by`, `mortgage_bank_status`, `bank_documents_complete`, `bank_documents_complete_at`, `bank_documents_complete_by`, `loan_saved`, `loan_saved_at`, `loan_saved_by`, `seller_payment_done`, `seller_payment_done_at`, `seller_payment_done_by`, `management_cancel`, `guarantee_transfer`, `key_status`, `account_transfer`, `ledger_entry`, `ledger_entry_at`, `ledger_entry_by`, `created_at`, `updated_at` FROM `settlement_progress`;--> statement-breakpoint
DROP TABLE `settlement_progress`;--> statement-breakpoint
ALTER TABLE `settlement_progress_new` RENAME TO `settlement_progress`;--> statement-breakpoint
CREATE UNIQUE INDEX `uk_settlement_progress_property_id` ON `settlement_progress` (`property_id`);--> statement-breakpoint

-- 4. Recreate property_document_items table
CREATE TABLE `property_document_items_new` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
	`item_type` text NOT NULL,
	`status` text DEFAULT 'not_requested' NOT NULL,
	`updated_at` integer,
	`updated_by` text REFERENCES users(id) ON DELETE SET NULL
);--> statement-breakpoint
INSERT INTO `property_document_items_new` SELECT * FROM `property_document_items`;--> statement-breakpoint
DROP TABLE `property_document_items`;--> statement-breakpoint
ALTER TABLE `property_document_items_new` RENAME TO `property_document_items`;--> statement-breakpoint
CREATE INDEX `idx_property_document_items_property_id` ON `property_document_items` (`property_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_property_document_items_property_item` ON `property_document_items` (`property_id`,`item_type`);--> statement-breakpoint

-- 5. Recreate property_progress_history table
CREATE TABLE `property_progress_history_new` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
	`from_status` text,
	`to_status` text NOT NULL,
	`changed_by` text REFERENCES users(id) ON DELETE SET NULL,
	`changed_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
INSERT INTO `property_progress_history_new` SELECT * FROM `property_progress_history`;--> statement-breakpoint
DROP TABLE `property_progress_history`;--> statement-breakpoint
ALTER TABLE `property_progress_history_new` RENAME TO `property_progress_history`;--> statement-breakpoint
CREATE INDEX `idx_property_progress_history_property_id` ON `property_progress_history` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_progress_history_changed_at` ON `property_progress_history` (`changed_at`);--> statement-breakpoint

-- 6. Recreate select_options table
CREATE TABLE `select_options_new` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`value` text NOT NULL,
	`created_by` text REFERENCES users(id) ON DELETE SET NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);--> statement-breakpoint
INSERT INTO `select_options_new` SELECT * FROM `select_options`;--> statement-breakpoint
DROP TABLE `select_options`;--> statement-breakpoint
ALTER TABLE `select_options_new` RENAME TO `select_options`;--> statement-breakpoint
CREATE INDEX `select_options_category_idx` ON `select_options` (`category`);--> statement-breakpoint

PRAGMA foreign_keys=ON;
