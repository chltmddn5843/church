ALTER TABLE `gallery` ADD `category` text DEFAULT '교회' NOT NULL;
ALTER TABLE `popups` ADD `width` integer DEFAULT 420 NOT NULL;
ALTER TABLE `popups` ADD `height` integer DEFAULT 540 NOT NULL;

CREATE TABLE `offering_reports` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `accessToken` text NOT NULL,
  `active` integer DEFAULT true NOT NULL,
  `createdAt` integer DEFAULT (unixepoch()) NOT NULL,
  `updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE UNIQUE INDEX `offering_reports_accessToken_unique` ON `offering_reports` (`accessToken`);
