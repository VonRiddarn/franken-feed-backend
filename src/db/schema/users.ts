import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { newEntityTable } from "./_entityTable.ts";

export const users = pgTable(
	"users",
	newEntityTable({
		username: varchar({ length: 42 }).notNull().unique(),
		passwordHash: varchar("password_hash", { length: 255 }).notNull(),
		avatarUrl: varchar("avatar_url", { length: 255 }),
		markdownBio: text("markdown_bio"),
	})
);
