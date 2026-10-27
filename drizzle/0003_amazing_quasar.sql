CREATE TABLE `gift_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`category` varchar(80) NOT NULL,
	`description` text NOT NULL,
	`reservedBy` varchar(160),
	`reservedPhone` varchar(32),
	`reservedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gift_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `gift_items_slug_unique` UNIQUE(`slug`)
);
