CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address_line_1` text NOT NULL,
	`address_line_2` text,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip_code` text NOT NULL,
	`country` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`unit_number` text NOT NULL,
	`bedrooms` integer NOT NULL,
	`bathrooms` real NOT NULL,
	`square_feet` integer,
	`rent` integer NOT NULL,
	`status` text DEFAULT 'vacant' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `units_property_id_unit_number_unique` ON `units` (`property_id`,`unit_number`);