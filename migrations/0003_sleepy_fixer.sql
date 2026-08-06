CREATE TABLE `attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`postId` integer NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`contentType` text NOT NULL,
	`size` integer NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_groups` (
	`userId` text NOT NULL,
	`group` text NOT NULL,
	PRIMARY KEY(`userId`, `group`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `content_pages` ADD `visibility` text DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `visibility` text DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `legacyBoard` integer;--> statement-breakpoint
ALTER TABLE `posts` ADD `legacyId` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `posts_legacy_unique` ON `posts` (`legacyBoard`,`legacyId`);
--> statement-breakpoint
UPDATE `user` SET `emailVerified` = true WHERE `role` = 'admin';
