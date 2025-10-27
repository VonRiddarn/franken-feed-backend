// repositories/likeRepository.ts
import { db } from "../db/db.ts";
import { likes } from "../db/schema/likes.ts";
import { and, eq } from "drizzle-orm";
import type { LikeSelect } from "../models/entities/Like.ts";

/** Find an existing like for (userId, postId). */
export const findExistingLike = async (userId: number, postId: number): Promise<LikeSelect | null> =>
	(
		await db
			.select()
			.from(likes)
			.where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
			.limit(1)
	)[0] ?? null;

/** Insert a like row. Throws if insert failed (shouldn’t happen on PG returning). */
export const insertLike = async (userId: number, postId: number): Promise<LikeSelect> => {
	const [row] = (await db.insert(likes).values({ userId, postId }).returning()) as LikeSelect[];
	if (!row) throw new Error("INSERT_FAILED");
	return row;
};

/** Delete a like for (userId, postId). Returns number of rows removed (0 or 1). */
export const deleteLike = async (userId: number, postId: number): Promise<number> => {
	const res = await db
		.delete(likes)
		.where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
		.returning({ id: likes.id });
	return res.length;
};
