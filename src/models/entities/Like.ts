import type { likes } from "../../db/schema/likes.ts";

/** Type for database insertion. */
export type LikeInsert = typeof likes.$inferInsert;
/** Type for database selection. */
export type LikeSelect = typeof likes.$inferSelect;
