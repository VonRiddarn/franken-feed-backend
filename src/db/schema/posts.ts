import { integer, pgTable, text, type AnyPgColumn } from "drizzle-orm/pg-core";
import { newEntityTable } from "./_entityTable.ts";
import { users } from "./users.ts";

export const posts = pgTable(
	"posts",
	newEntityTable({
		parentId: integer("parent_id").references((): AnyPgColumn => posts.id),
		authorId: integer("author_id")
			.notNull()
			.references((): AnyPgColumn => users.id),
		body: text(),
	})
);
