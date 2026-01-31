DROP INDEX IF EXISTS "accounts_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "invitations_organizationId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "invitations_email_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "members_organizationId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "members_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "organizations_slug_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "sessions_token_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "sessions_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "teamMembers_teamId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "teamMembers_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "teams_organizationId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "users_email_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "users_username_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "verifications_identifier_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "uk_contract_progress_property_id";--> statement-breakpoint
DROP INDEX IF EXISTS "uk_document_progress_property_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_properties_organization_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_properties_progress_status";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_properties_document_status";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_properties_settlement_date";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_properties_created_at";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_property_progress_history_property_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_property_progress_history_changed_at";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_property_staff_property_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_property_staff_user_id";--> statement-breakpoint
DROP INDEX IF EXISTS "uk_property_staff_property_user";--> statement-breakpoint
DROP INDEX IF EXISTS "uk_settlement_progress_property_id";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "is_anonymous" TO "is_anonymous" integer DEFAULT false;--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `invitations_organizationId_idx` ON `invitations` (`organization_id`);--> statement-breakpoint
CREATE INDEX `invitations_email_idx` ON `invitations` (`email`);--> statement-breakpoint
CREATE INDEX `members_organizationId_idx` ON `members` (`organization_id`);--> statement-breakpoint
CREATE INDEX `members_userId_idx` ON `members` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `teamMembers_teamId_idx` ON `team_members` (`team_id`);--> statement-breakpoint
CREATE INDEX `teamMembers_userId_idx` ON `team_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `teams_organizationId_idx` ON `teams` (`organization_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `verifications_identifier_idx` ON `verifications` (`identifier`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_contract_progress_property_id` ON `contract_progress` (`property_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_document_progress_property_id` ON `document_progress` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_properties_organization_id` ON `properties` (`organization_id`);--> statement-breakpoint
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
ALTER TABLE `invitations` ADD `created_at` integer DEFAULT 0 NOT NULL;