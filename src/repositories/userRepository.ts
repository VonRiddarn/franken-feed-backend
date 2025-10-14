import { db } from "../db/db.ts";
import { users } from "../db/schema/users.ts";
import { ilike, eq, sql } from "drizzle-orm";

// Type used to describe what parameters listUsers() accepts
type ListArgs = { search: string; limit: number; offset: number };

/** Fetches a list of users from the database.
 * Supports optional search term, pagination (limit + offset),
 * and returns user data formatted as a User DTO.
 */
export async function findAllUsers({ search, limit, offset }: ListArgs) {
	// Sanitize and set safe defaults for limit and offset
	const safelimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
	const safeoffset = Math.max(Number(offset) || 0, 0);

	// Build and run the SELECT query
	const rows = await db
		.select({
			id: users.id,
			createdAt: users.createdAt,
			username: users.username,
			avatarUrl: users.avatarUrl,
			markdownBio: users.markdownBio,
		})
		.from(users)
		.where(ilike(users.username, `%${search}%`))
		.orderBy(sql`${users.createdAt} desc`)
		.limit(safelimit)
		.offset(safeoffset);

	// Return the result directly to the route handler
	return rows;
}

/** Fetches a single user based on their unique ID.
 * Returns null if no user with that ID exists.
 */
export async function findUserById(id: number) {
	// Run a SELECT query that only expects one user
	const [row] = await db
		.select({
			id: users.id,
			createdAt: users.createdAt,
			username: users.username,
			avatarUrl: users.avatarUrl,
			markdownBio: users.markdownBio,
		})
		.from(users)
		.where(eq(users.id, id));

	// If no match is found, row will be undefined, return null instead
	return row ?? null;
}

/** Fetches a single user based on their username.
 * Returns null if no user with that username exists.
 */
export async function findByUsername(username: string) {
	const [row] = await db
		.select({
			id: users.id,
			createdAt: users.createdAt,
			username: users.username,
			avatarUrl: users.avatarUrl,
			markdownBio: users.markdownBio,
		})
		.from(users)
		.where(eq(users.username, username));

	return row ?? null;
}
