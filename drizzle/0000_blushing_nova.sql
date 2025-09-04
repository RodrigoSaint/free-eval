CREATE TABLE `eval_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`model` text NOT NULL,
	`version` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evals` (
	`id` text PRIMARY KEY NOT NULL,
	`input` text NOT NULL,
	`output` text NOT NULL,
	`expected` text,
	`score` real NOT NULL,
	`duration` real DEFAULT 0 NOT NULL,
	`input_finger_print` text NOT NULL,
	`eval_group_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`eval_group_id`) REFERENCES `eval_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `input_finger_print_idx` ON `evals` (`input_finger_print`);