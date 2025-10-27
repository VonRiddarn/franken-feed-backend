import { db } from "../db/db.ts";
import { posts } from "../db/schema/posts.ts";
import { likes } from "../db/schema/likes.ts";
import { and, desc, eq, ilike, isNull } from "drizzle-orm";
import type { PostSelect } from "../models/entities/posts.ts";

export type PostFilters = {
	search?: string;
	authorId?: number;
	likedByUserId?: number;
	limit?: number;
	offset?: number;
	onlyTopLevel?: boolean;
	parentId?: number;
};

export const findAllPosts = async (filters: PostFilters = {}): Promise<PostSelect[]> => {
	const {
		search,
		authorId,
		likedByUserId,
		limit = 50,
		offset = 0,
		onlyTopLevel = true,
		parentId,
	} = filters;

	const whereClauses = [
		authorId ? eq(posts.authorId, authorId) : undefined,
		search ? ilike(posts.body, `%${search}%`) : undefined,
		onlyTopLevel ? isNull(posts.parentId) : undefined,
		parentId !== undefined ? eq(posts.parentId, parentId) : undefined,
	].filter(Boolean) as any[];

	// Base query
	let base = db
		.select()
		.from(posts)
		.where(and(...whereClauses))
		.orderBy(desc(posts.createdAt), desc(posts.id))
		.limit(limit)
		.offset(offset);

	// If filtering by “liked by user”, intersect with likes
	if (likedByUserId) {
		base = db
			.select({
				id: posts.id,
				createdAt: posts.createdAt,
				updatedAt: posts.updatedAt,
				authorId: posts.authorId,
				parentId: posts.parentId,
				body: posts.body,
			})
			.from(likes)
			.innerJoin(posts, and(eq(likes.postId, posts.id)))
			.where(and(...whereClauses, eq(likes.userId, likedByUserId)))
			.orderBy(desc(posts.createdAt), desc(posts.id))
			.limit(limit)
			.offset(offset) as any;
	}

	return await base;
};

export const findPostById = async (id: number): Promise<PostSelect | null> =>
	(await db.select().from(posts).where(eq(posts.id, id)).limit(1))[0] ?? null;

export const insertPost = async (
	authorId: number,
	body: string,
	parentId: number | null
): Promise<PostSelect> => {
	const [row] = await db.insert(posts).values({ authorId, body, parentId }).returning();

	if (!row) {
		throw new Error("INSERT_FAILED");
	}
	return row;
};

export const updatePostBodyByAuthor = async (
	postId: number,
	authorId: number,
	newBody: string
): Promise<PostSelect | null> => {
	const rows = await db
		.update(posts)
		.set({ body: newBody })
		.where(and(eq(posts.id, postId), eq(posts.authorId, authorId)))
		.returning();
	return rows[0] ?? null;
};

export const deletePostByIdAndAuthor = async (postId: number, authorId: number) =>
	await db
		.delete(posts)
		.where(and(eq(posts.id, postId), eq(posts.authorId, authorId)))
		.returning();

export const findChildren = async (parentId: number, limit = 50, offset = 0) =>
	await db
		.select()
		.from(posts)
		.where(eq(posts.parentId, parentId))
		.orderBy(desc(posts.createdAt), desc(posts.id))
		.limit(limit)
		.offset(offset);
