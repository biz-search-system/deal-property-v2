PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_contract_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`maisoku_distribution` text DEFAULT 'not_distributed' NOT NULL,
	`maisoku_distribution_at` integer,
	`maisoku_distribution_by` text,
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
	FOREIGN KEY (`maisoku_distribution_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`ab_contract_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`ab_authorization_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`ab_seller_id_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`bc_contract_created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`bc_description_created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`bc_contract_sent_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`bc_description_sent_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`bc_contract_cb_done_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`bc_description_cb_done_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_contract_progress`("id", "property_id", "maisoku_distribution", "maisoku_distribution_at", "maisoku_distribution_by", "ab_contract_saved", "ab_contract_saved_at", "ab_contract_saved_by", "ab_authorization_saved", "ab_authorization_saved_at", "ab_authorization_saved_by", "ab_seller_id_saved", "ab_seller_id_saved_at", "ab_seller_id_saved_by", "bc_contract_created", "bc_contract_created_at", "bc_contract_created_by", "bc_description_created", "bc_description_created_at", "bc_description_created_by", "bc_contract_sent", "bc_contract_sent_at", "bc_contract_sent_by", "bc_description_sent", "bc_description_sent_at", "bc_description_sent_by", "bc_contract_cb_done", "bc_contract_cb_done_at", "bc_contract_cb_done_by", "bc_description_cb_done", "bc_description_cb_done_at", "bc_description_cb_done_by", "created_at", "updated_at") SELECT "id", "property_id", "maisoku_distribution", "maisoku_distribution_at", "maisoku_distribution_by", "ab_contract_saved", "ab_contract_saved_at", "ab_contract_saved_by", "ab_authorization_saved", "ab_authorization_saved_at", "ab_authorization_saved_by", "ab_seller_id_saved", "ab_seller_id_saved_at", "ab_seller_id_saved_by", "bc_contract_created", "bc_contract_created_at", "bc_contract_created_by", "bc_description_created", "bc_description_created_at", "bc_description_created_by", "bc_contract_sent", "bc_contract_sent_at", "bc_contract_sent_by", "bc_description_sent", "bc_description_sent_at", "bc_description_sent_by", "bc_contract_cb_done", "bc_contract_cb_done_at", "bc_contract_cb_done_by", "bc_description_cb_done", "bc_description_cb_done_at", "bc_description_cb_done_by", "created_at", "updated_at" FROM `contract_progress`;--> statement-breakpoint
DROP TABLE `contract_progress`;--> statement-breakpoint
ALTER TABLE `__new_contract_progress` RENAME TO `contract_progress`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `uk_contract_progress_property_id` ON `contract_progress` (`property_id`);--> statement-breakpoint
CREATE TABLE `__new_document_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`status` text DEFAULT 'waiting_request' NOT NULL,
	`updated_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_document_progress`("id", "property_id", "status", "updated_by", "created_at", "updated_at") SELECT "id", "property_id", "status", "updated_by", "created_at", "updated_at" FROM `document_progress`;--> statement-breakpoint
DROP TABLE `document_progress`;--> statement-breakpoint
ALTER TABLE `__new_document_progress` RENAME TO `document_progress`;--> statement-breakpoint
CREATE UNIQUE INDEX `uk_document_progress_property_id` ON `document_progress` (`property_id`);--> statement-breakpoint
CREATE TABLE `__new_properties` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
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
	`contract_date_a_updated_by` text,
	`contract_date_bc` integer,
	`contract_date_bc_updated_at` integer,
	`contract_date_bc_updated_by` text,
	`settlement_date` integer,
	`settlement_date_updated_at` integer,
	`settlement_date_updated_by` text,
	`contract_type` text,
	`company_b` text,
	`broker_company` text,
	`buyer_company` text,
	`mortgage_bank` text,
	`list_type` text,
	`progress_status` text DEFAULT 'bc_before_confirmed' NOT NULL,
	`progress_status_updated_at` integer,
	`progress_status_updated_by` text,
	`document_status` text DEFAULT 'waiting_request' NOT NULL,
	`document_status_updated_at` integer,
	`document_status_updated_by` text,
	`notes` text,
	`account_company` text,
	`bank_account` text,
	`created_by` text,
	`updated_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contract_date_a_updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`contract_date_bc_updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`settlement_date_updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`progress_status_updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`document_status_updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_properties`("id", "organization_id", "property_name", "room_number", "owner_name", "amount_a", "amount_exit", "commission", "profit", "bc_deposit", "contract_date_a", "contract_date_a_updated_at", "contract_date_a_updated_by", "contract_date_bc", "contract_date_bc_updated_at", "contract_date_bc_updated_by", "settlement_date", "settlement_date_updated_at", "settlement_date_updated_by", "contract_type", "company_b", "broker_company", "buyer_company", "mortgage_bank", "list_type", "progress_status", "progress_status_updated_at", "progress_status_updated_by", "document_status", "document_status_updated_at", "document_status_updated_by", "notes", "account_company", "bank_account", "created_by", "updated_by", "created_at", "updated_at") SELECT "id", "organization_id", "property_name", "room_number", "owner_name", "amount_a", "amount_exit", "commission", "profit", "bc_deposit", "contract_date_a", "contract_date_a_updated_at", "contract_date_a_updated_by", "contract_date_bc", "contract_date_bc_updated_at", "contract_date_bc_updated_by", "settlement_date", "settlement_date_updated_at", "settlement_date_updated_by", "contract_type", "company_b", "broker_company", "buyer_company", "mortgage_bank", "list_type", "progress_status", "progress_status_updated_at", "progress_status_updated_by", "document_status", "document_status_updated_at", "document_status_updated_by", "notes", "account_company", "bank_account", "created_by", "updated_by", "created_at", "updated_at" FROM `properties`;--> statement-breakpoint
DROP TABLE `properties`;--> statement-breakpoint
ALTER TABLE `__new_properties` RENAME TO `properties`;--> statement-breakpoint
CREATE INDEX `idx_properties_organization_id` ON `properties` (`organization_id`);--> statement-breakpoint
CREATE INDEX `idx_properties_progress_status` ON `properties` (`progress_status`);--> statement-breakpoint
CREATE INDEX `idx_properties_document_status` ON `properties` (`document_status`);--> statement-breakpoint
CREATE INDEX `idx_properties_settlement_date` ON `properties` (`settlement_date`);--> statement-breakpoint
CREATE INDEX `idx_properties_created_at` ON `properties` (`created_at`);--> statement-breakpoint
CREATE TABLE `__new_property_document_items` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`item_type` text NOT NULL,
	`status` text DEFAULT 'not_requested' NOT NULL,
	`updated_at` integer,
	`updated_by` text,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_property_document_items`("id", "property_id", "item_type", "status", "updated_at", "updated_by") SELECT "id", "property_id", "item_type", "status", "updated_at", "updated_by" FROM `property_document_items`;--> statement-breakpoint
DROP TABLE `property_document_items`;--> statement-breakpoint
ALTER TABLE `__new_property_document_items` RENAME TO `property_document_items`;--> statement-breakpoint
CREATE INDEX `idx_property_document_items_property_id` ON `property_document_items` (`property_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_property_document_items_property_item` ON `property_document_items` (`property_id`,`item_type`);--> statement-breakpoint
CREATE TABLE `__new_property_progress_history` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`changed_by` text,
	`changed_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_property_progress_history`("id", "property_id", "from_status", "to_status", "changed_by", "changed_at") SELECT "id", "property_id", "from_status", "to_status", "changed_by", "changed_at" FROM `property_progress_history`;--> statement-breakpoint
DROP TABLE `property_progress_history`;--> statement-breakpoint
ALTER TABLE `__new_property_progress_history` RENAME TO `property_progress_history`;--> statement-breakpoint
CREATE INDEX `idx_property_progress_history_property_id` ON `property_progress_history` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_progress_history_changed_at` ON `property_progress_history` (`changed_at`);--> statement-breakpoint
CREATE TABLE `__new_property_staff` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_property_staff`("id", "property_id", "user_id", "created_at") SELECT "id", "property_id", "user_id", "created_at" FROM `property_staff`;--> statement-breakpoint
DROP TABLE `property_staff`;--> statement-breakpoint
ALTER TABLE `__new_property_staff` RENAME TO `property_staff`;--> statement-breakpoint
CREATE INDEX `idx_property_staff_property_id` ON `property_staff` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_staff_user_id` ON `property_staff` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_settlement_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`bc_settlement_status` text DEFAULT 'not_created' NOT NULL,
	`bc_settlement_status_at` integer,
	`bc_settlement_status_by` text,
	`ab_settlement_status` text DEFAULT 'not_created' NOT NULL,
	`ab_settlement_status_at` integer,
	`ab_settlement_status_by` text,
	`loan_calculation_saved` integer DEFAULT false NOT NULL,
	`loan_calculation_saved_at` integer,
	`loan_calculation_saved_by` text,
	`lawyer_requested` integer DEFAULT false NOT NULL,
	`lawyer_requested_at` integer,
	`lawyer_requested_by` text,
	`documents_shared` integer DEFAULT false NOT NULL,
	`documents_shared_at` integer,
	`documents_shared_by` text,
	`management_cancel_scheduled_month` text,
	`management_cancel_scheduled_month_at` integer,
	`management_cancel_scheduled_month_by` text,
	`management_cancel_requested_date` text,
	`management_cancel_requested_date_at` integer,
	`management_cancel_requested_date_by` text,
	`management_cancel_completed_date` text,
	`management_cancel_completed_date_at` integer,
	`management_cancel_completed_date_by` text,
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
	`mortgage_cancellation` text DEFAULT 'not_requested',
	`mortgage_cancellation_at` integer,
	`mortgage_cancellation_by` text,
	`property_title` integer DEFAULT false NOT NULL,
	`property_title_at` integer,
	`property_title_by` text,
	`address_change` integer DEFAULT false NOT NULL,
	`address_change_at` integer,
	`address_change_by` text,
	`name_change` integer DEFAULT false NOT NULL,
	`name_change_at` integer,
	`name_change_by` text,
	`identity_verification_method` text,
	`identity_verification_method_at` integer,
	`identity_verification_method_by` text,
	`identity_verification_call` text DEFAULT 'not_requested',
	`identity_verification_call_at` integer,
	`identity_verification_call_by` text,
	`identity_verification_call_schedule` text,
	`identity_verification_call_schedule_at` integer,
	`identity_verification_call_schedule_by` text,
	`identity_verification_status` text DEFAULT 'not_started',
	`identity_verification_status_at` integer,
	`identity_verification_status_by` text,
	`seller_funding_status` text DEFAULT 'not_required',
	`seller_funding_status_at` integer,
	`seller_funding_status_by` text,
	`sublease_succession` text DEFAULT 'not_required',
	`sublease_succession_at` integer,
	`sublease_succession_by` text,
	`rental_contract_and_key` text DEFAULT 'not_requested',
	`rental_contract_and_key_at` integer,
	`rental_contract_and_key_by` text,
	`guarantee_company_succession` text DEFAULT 'not_required',
	`guarantee_company_succession_at` integer,
	`guarantee_company_succession_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bc_settlement_status_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`ab_settlement_status_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`loan_calculation_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`lawyer_requested_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`documents_shared_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`management_cancel_scheduled_month_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`management_cancel_requested_date_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`management_cancel_completed_date_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`documents_complete_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`bank_documents_complete_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`loan_saved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`seller_payment_done_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`ledger_entry_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`mortgage_cancellation_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`property_title_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`address_change_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`name_change_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`identity_verification_method_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`identity_verification_call_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`identity_verification_call_schedule_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`identity_verification_status_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`seller_funding_status_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`sublease_succession_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`rental_contract_and_key_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`guarantee_company_succession_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_settlement_progress`("id", "property_id", "bc_settlement_status", "bc_settlement_status_at", "bc_settlement_status_by", "ab_settlement_status", "ab_settlement_status_at", "ab_settlement_status_by", "loan_calculation_saved", "loan_calculation_saved_at", "loan_calculation_saved_by", "lawyer_requested", "lawyer_requested_at", "lawyer_requested_by", "documents_shared", "documents_shared_at", "documents_shared_by", "management_cancel_scheduled_month", "management_cancel_scheduled_month_at", "management_cancel_scheduled_month_by", "management_cancel_requested_date", "management_cancel_requested_date_at", "management_cancel_requested_date_by", "management_cancel_completed_date", "management_cancel_completed_date_at", "management_cancel_completed_date_by", "identity_verification", "documents_complete", "documents_complete_at", "documents_complete_by", "mortgage_bank_status", "bank_documents_complete", "bank_documents_complete_at", "bank_documents_complete_by", "loan_saved", "loan_saved_at", "loan_saved_by", "seller_payment_done", "seller_payment_done_at", "seller_payment_done_by", "management_cancel", "guarantee_transfer", "key_status", "account_transfer", "ledger_entry", "ledger_entry_at", "ledger_entry_by", "created_at", "updated_at") SELECT "id", "property_id", "bc_settlement_status", "bc_settlement_status_at", "bc_settlement_status_by", "ab_settlement_status", "ab_settlement_status_at", "ab_settlement_status_by", "loan_calculation_saved", "loan_calculation_saved_at", "loan_calculation_saved_by", "lawyer_requested", "lawyer_requested_at", "lawyer_requested_by", "documents_shared", "documents_shared_at", "documents_shared_by", "management_cancel_scheduled_month", "management_cancel_scheduled_month_at", "management_cancel_scheduled_month_by", "management_cancel_requested_date", "management_cancel_requested_date_at", "management_cancel_requested_date_by", "management_cancel_completed_date", "management_cancel_completed_date_at", "management_cancel_completed_date_by", "identity_verification", "documents_complete", "documents_complete_at", "documents_complete_by", "mortgage_bank_status", "bank_documents_complete", "bank_documents_complete_at", "bank_documents_complete_by", "loan_saved", "loan_saved_at", "loan_saved_by", "seller_payment_done", "seller_payment_done_at", "seller_payment_done_by", "management_cancel", "guarantee_transfer", "key_status", "account_transfer", "ledger_entry", "ledger_entry_at", "ledger_entry_by", "created_at", "updated_at" FROM `settlement_progress`;--> statement-breakpoint
DROP TABLE `settlement_progress`;--> statement-breakpoint
ALTER TABLE `__new_settlement_progress` RENAME TO `settlement_progress`;--> statement-breakpoint
CREATE UNIQUE INDEX `uk_settlement_progress_property_id` ON `settlement_progress` (`property_id`);