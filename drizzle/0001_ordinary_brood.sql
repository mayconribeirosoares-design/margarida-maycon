CREATE TABLE `rsvps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guestName` varchar(160) NOT NULL,
	`phone` varchar(32),
	`status` enum('confirmed','declined') NOT NULL,
	`companions` int NOT NULL DEFAULT 0,
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rsvps_id` PRIMARY KEY(`id`)
);
