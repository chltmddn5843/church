CREATE INDEX `sermons_category_preached_idx` ON `sermons` (`category`,`preachedAt`);
CREATE INDEX `posts_category_pinned_created_idx` ON `posts` (`category`,`pinned`,`createdAt`);
CREATE INDEX `attachments_post_idx` ON `attachments` (`postId`);
CREATE INDEX `gallery_category_created_idx` ON `gallery` (`category`,`createdAt`);
