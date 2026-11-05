CREATE TABLE `site_content` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `site_content` (`key`, `value`, `updatedAt`) SELECT 'hero.' || `slot` || '.image', `imageUrl`, `updatedAt` FROM `hero_images`;
--> statement-breakpoint
DROP TABLE `hero_images`;
