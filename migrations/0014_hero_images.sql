CREATE TABLE `hero_images` (
	`slot` integer PRIMARY KEY NOT NULL,
	`imageUrl` text NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
