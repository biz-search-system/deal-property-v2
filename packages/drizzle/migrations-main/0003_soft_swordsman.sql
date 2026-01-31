CREATE TABLE `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`organization_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP INDEX "organizations_slug_unique";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "users_username_unique";--> statement-breakpoint
DROP INDEX "uk_contract_progress_property_id";--> statement-breakpoint
DROP INDEX "uk_document_progress_property_id";--> statement-breakpoint
DROP INDEX "idx_properties_progress_status";--> statement-breakpoint
DROP INDEX "idx_properties_document_status";--> statement-breakpoint
DROP INDEX "idx_properties_settlement_date";--> statement-breakpoint
DROP INDEX "idx_properties_created_at";--> statement-breakpoint
DROP INDEX "idx_property_progress_history_property_id";--> statement-breakpoint
DROP INDEX "idx_property_progress_history_changed_at";--> statement-breakpoint
DROP INDEX "idx_property_staff_property_id";--> statement-breakpoint
DROP INDEX "idx_property_staff_user_id";--> statement-breakpoint
DROP INDEX "uk_property_staff_property_user";--> statement-breakpoint
DROP INDEX "uk_settlement_progress_property_id";--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "access_token_expires_at" TO "access_token_expires_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_contract_progress_property_id` ON `contract_progress` (`property_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_document_progress_property_id` ON `document_progress` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_properties_progress_status` ON `properties` (`progress_status`);--> statement-breakpoint
CREATE INDEX `idx_properties_document_status` ON `properties` (`document_status`);--> statement-breakpoint
CREATE INDEX `idx_properties_settlement_date` ON `properties` (`settlement_date`);--> statement-breakpoint
CREATE INDEX `idx_properties_created_at` ON `properties` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_property_progress_history_property_id` ON `property_progress_history` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_progress_history_changed_at` ON `property_progress_history` (`changed_at`);--> statement-breakpoint
CREATE INDEX `idx_property_staff_property_id` ON `property_staff` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_staff_user_id` ON `property_staff` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_property_staff_property_user` ON `property_staff` (`property_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_settlement_progress_property_id` ON `settlement_progress` (`property_id`);--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "refresh_token_expires_at" TO "refresh_token_expires_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "expires_at" TO "expires_at" integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `sessions` ADD `active_team_id` text;--> statement-breakpoint
ALTER TABLE `verifications` ALTER COLUMN "expires_at" TO "expires_at" integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "ab_contract_saved_at" TO "ab_contract_saved_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "ab_authorization_saved_at" TO "ab_authorization_saved_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "ab_seller_id_saved_at" TO "ab_seller_id_saved_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "bc_contract_created_at" TO "bc_contract_created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "bc_description_created_at" TO "bc_description_created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "bc_contract_sent_at" TO "bc_contract_sent_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "bc_description_sent_at" TO "bc_description_sent_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "bc_contract_cb_done_at" TO "bc_contract_cb_done_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `contract_progress` ALTER COLUMN "bc_description_cb_done_at" TO "bc_description_cb_done_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `properties` ALTER COLUMN "contract_date_a" TO "contract_date_a" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `properties` ALTER COLUMN "contract_date_bc" TO "contract_date_bc" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `properties` ALTER COLUMN "settlement_date" TO "settlement_date" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `settlement_progress` ALTER COLUMN "loan_calculation_saved_at" TO "loan_calculation_saved_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `settlement_progress` ALTER COLUMN "lawyer_requested_at" TO "lawyer_requested_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `settlement_progress` ALTER COLUMN "documents_shared_at" TO "documents_shared_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `settlement_progress` ALTER COLUMN "documents_complete_at" TO "documents_complete_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `settlement_progress` ALTER COLUMN "bank_documents_complete_at" TO "bank_documents_complete_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `settlement_progress` ALTER COLUMN "loan_saved_at" TO "loan_saved_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `settlement_progress` ALTER COLUMN "seller_payment_done_at" TO "seller_payment_done_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `settlement_progress` ALTER COLUMN "ledger_entry_at" TO "ledger_entry_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
ALTER TABLE `invitations` ADD `team_id` text;