CREATE TABLE `board_passwords` (
	`category` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
