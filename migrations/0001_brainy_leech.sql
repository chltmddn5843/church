CREATE TABLE `content_pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`legacyId` integer NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`imageUrl` text,
	`published` integer DEFAULT true NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_pages_legacyId_unique` ON `content_pages` (`legacyId`);