import type { posts } from "../../db/schema/posts.ts";

/** Type for database insertion. */
export type PostInsert = typeof posts.$inferInsert;
/** Type for database selection. */
export type PostSelect = typeof posts.$inferSelect;
