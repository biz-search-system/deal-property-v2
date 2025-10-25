CREATE TABLE `pets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`hp` integer DEFAULT 50 NOT NULL,
	`owner_id` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contract_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`ab_contract_saved` integer DEFAULT false NOT NULL,
	`ab_contract_saved_at` integer,
	`ab_contract_saved_by` text,
	`ab_authorization_saved` integer DEFAULT false NOT NULL,
	`ab_authorization_saved_at` integer,
	`ab_authorization_saved_by` text,
	`ab_seller_id_saved` integer DEFAULT false NOT NULL,
	`ab_seller_id_saved_at` integer,
	`ab_seller_id_saved_by` text,
	`bc_contract_created` integer DEFAULT false NOT NULL,
	`bc_contract_created_at` integer,
	`bc_contract_created_by` text,
	`bc_description_created` integer DEFAULT false NOT NULL,
	`bc_description_created_at` integer,
	`bc_description_created_by` text,
	`bc_contract_sent` integer DEFAULT false NOT NULL,
	`bc_contract_sent_at` integer,
	`bc_contract_sent_by` text,
	`bc_description_sent` integer DEFAULT false NOT NULL,
	`bc_description_sent_at` integer,
	`bc_description_sent_by` text,
	`bc_contract_cb_done` integer DEFAULT false NOT NULL,
	`bc_contract_cb_done_at` integer,
	`bc_contract_cb_done_by` text,
	`bc_description_cb_done` integer DEFAULT false NOT NULL,
	`bc_description_cb_done_at` integer,
	`bc_description_cb_done_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ab_contract_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ab_authorization_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ab_seller_id_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bc_contract_created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bc_description_created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bc_contract_sent_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bc_description_sent_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bc_contract_cb_done_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bc_description_cb_done_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uk_contract_progress_property_id` ON `contract_progress` (`property_id`);--> statement-breakpoint
CREATE TABLE `document_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`status` text DEFAULT 'waiting_request' NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uk_document_progress_property_id` ON `document_progress` (`property_id`);--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`property_name` text NOT NULL,
	`room_number` text,
	`owner_name` text NOT NULL,
	`amount_a` real,
	`amount_exit` real,
	`commission` real,
	`profit` real,
	`bc_deposit` real,
	`contract_date_a` integer,
	`contract_date_bc` integer,
	`settlement_date` integer,
	`contract_type` text,
	`company_b` text,
	`broker_company` text,
	`buyer_company` text,
	`mortgage_bank` text,
	`list_type` text,
	`progress_status` text DEFAULT 'bc_before_confirmed' NOT NULL,
	`document_status` text DEFAULT 'waiting_request' NOT NULL,
	`notes` text,
	`account_company` text,
	`bank_account` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_properties_progress_status` ON `properties` (`progress_status`);--> statement-breakpoint
CREATE INDEX `idx_properties_document_status` ON `properties` (`document_status`);--> statement-breakpoint
CREATE INDEX `idx_properties_settlement_date` ON `properties` (`settlement_date`);--> statement-breakpoint
CREATE INDEX `idx_properties_created_at` ON `properties` (`created_at`);--> statement-breakpoint
CREATE TABLE `property_progress_history` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`changed_by` text NOT NULL,
	`changed_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_property_progress_history_property_id` ON `property_progress_history` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_progress_history_changed_at` ON `property_progress_history` (`changed_at`);--> statement-breakpoint
CREATE TABLE `property_staff` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_property_staff_property_id` ON `property_staff` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_staff_user_id` ON `property_staff` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_property_staff_property_user` ON `property_staff` (`property_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `settlement_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`bc_settlement_status` text DEFAULT 'not_created' NOT NULL,
	`ab_settlement_status` text DEFAULT 'not_created' NOT NULL,
	`loan_calculation_saved` integer DEFAULT false NOT NULL,
	`loan_calculation_saved_at` integer,
	`loan_calculation_saved_by` text,
	`lawyer_requested` integer DEFAULT false NOT NULL,
	`lawyer_requested_at` integer,
	`lawyer_requested_by` text,
	`documents_shared` integer DEFAULT false NOT NULL,
	`documents_shared_at` integer,
	`documents_shared_by` text,
	`identity_verification` text DEFAULT 'none' NOT NULL,
	`documents_complete` integer DEFAULT false NOT NULL,
	`documents_complete_at` integer,
	`documents_complete_by` text,
	`mortgage_bank_status` text DEFAULT 'none' NOT NULL,
	`bank_documents_complete` integer DEFAULT false NOT NULL,
	`bank_documents_complete_at` integer,
	`bank_documents_complete_by` text,
	`loan_saved` integer DEFAULT false NOT NULL,
	`loan_saved_at` integer,
	`loan_saved_by` text,
	`seller_payment_done` integer DEFAULT false NOT NULL,
	`seller_payment_done_at` integer,
	`seller_payment_done_by` text,
	`management_cancel` text DEFAULT 'none' NOT NULL,
	`guarantee_transfer` text DEFAULT 'none' NOT NULL,
	`key_status` text DEFAULT 'none' NOT NULL,
	`account_transfer` text DEFAULT 'none' NOT NULL,
	`ledger_entry` integer DEFAULT false NOT NULL,
	`ledger_entry_at` integer,
	`ledger_entry_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`loan_calculation_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lawyer_requested_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`documents_shared_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`documents_complete_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bank_documents_complete_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`loan_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seller_payment_done_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ledger_entry_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uk_settlement_progress_property_id` ON `settlement_progress` (`property_id`);