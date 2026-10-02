DROP INDEX `offering_reports_accessToken_unique`;--> statement-breakpoint
CREATE INDEX `offering_reports_token_idx` ON `offering_reports` (`accessToken`);