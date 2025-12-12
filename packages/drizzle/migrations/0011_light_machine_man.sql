CREATE TABLE `property_document_items` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`item_type` text NOT NULL,
	`status` text DEFAULT 'not_requested' NOT NULL,
	`updated_at` integer,
	`updated_by` text,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_property_document_items_property_id` ON `property_document_items` (`property_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uk_property_document_items_property_item` ON `property_document_items` (`property_id`,`item_type`);