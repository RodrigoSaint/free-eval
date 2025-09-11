CREATE TABLE `eval_group_threshold` (
	`id` text PRIMARY KEY NOT NULL,
	`goodScore` real NOT NULL,
	`averageScore` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `eval_groups`(`id`) ON UPDATE no action ON DELETE no action
);
