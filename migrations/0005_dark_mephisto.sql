CREATE TABLE `live_stream` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`youtubeId` text NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
