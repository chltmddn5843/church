CREATE TABLE `gallery_albums` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` text DEFAULT '교회' NOT NULL,
	`legacyId` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gallery_albums_legacyId_unique` ON `gallery_albums` (`legacyId`);--> statement-breakpoint
CREATE INDEX `gallery_albums_category_created_idx` ON `gallery_albums` (`category`,`createdAt`);--> statement-breakpoint
ALTER TABLE `gallery` ADD `albumId` integer REFERENCES gallery_albums(id) ON DELETE cascade;--> statement-breakpoint
CREATE INDEX `gallery_album_idx` ON `gallery` (`albumId`);--> statement-breakpoint
-- Imported photos live under gallery/legacy/{old post id}/{n}.jpg and are titled "album (n)": one album per old post.
INSERT INTO `gallery_albums` (`title`, `category`, `legacyId`, `createdAt`)
SELECT trim(rtrim(min(`title`), '0123456789()')), min(`category`), CAST(`legacy` AS integer), max(`createdAt`)
FROM (SELECT *, substr(substr(`imageUrl`, 29), 1, instr(substr(`imageUrl`, 29), '/') - 1) AS `legacy` FROM `gallery` WHERE `imageUrl` LIKE '/api/uploads/gallery/legacy/%')
GROUP BY `legacy`;--> statement-breakpoint
UPDATE `gallery` SET `albumId` = (SELECT `id` FROM `gallery_albums` WHERE `legacyId` = CAST(substr(substr(`gallery`.`imageUrl`, 29), 1, instr(substr(`gallery`.`imageUrl`, 29), '/') - 1) AS integer))
WHERE `imageUrl` LIKE '/api/uploads/gallery/legacy/%';--> statement-breakpoint
-- Photos uploaded one by one become one-photo albums (negative legacyId is only a temporary join key).
INSERT INTO `gallery_albums` (`title`, `description`, `category`, `legacyId`, `createdAt`)
SELECT `title`, `description`, `category`, -`id`, `createdAt` FROM `gallery` WHERE `albumId` IS NULL;--> statement-breakpoint
UPDATE `gallery` SET `albumId` = (SELECT `id` FROM `gallery_albums` WHERE `legacyId` = -`gallery`.`id`) WHERE `albumId` IS NULL;--> statement-breakpoint
UPDATE `gallery_albums` SET `legacyId` = NULL WHERE `legacyId` < 0;--> statement-breakpoint
UPDATE `gallery` SET `title` = (SELECT `title` FROM `gallery_albums` WHERE `id` = `gallery`.`albumId`);
