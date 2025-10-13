import { pgTable, integer, type AnyPgColumn } from "drizzle-orm/pg-core";
import { newEntityTable } from "./_entityTable.ts";
import { users } from "./users.ts";
import { posts } from "./posts.ts";

export const likes = pgTable(
	"likes",
	newEntityTable({
		userId: integer("user_id")
			.notNull()
			.references((): AnyPgColumn => users.id),
		postId: integer("post_id")
			.notNull()
			.references((): AnyPgColumn => posts.id),
	})
);
