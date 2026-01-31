ALTER TABLE `master_options` RENAME TO `select_options`;--> statement-breakpoint
DROP INDEX IF EXISTS `master_options_category_idx`;--> statement-breakpoint
CREATE INDEX `select_options_category_idx` ON `select_options` (`category`);
