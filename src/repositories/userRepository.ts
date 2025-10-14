import { db } from "../db/db.ts";
import { users } from "../db/schema/users.ts";
import { ilike, eq } from "drizzle-orm";
import type { UserInsert, UserSelect } from "../models/entities/User.ts";

// Fetches/finds all users from the database.
export const findAllUsers = async (): Promise<UserSelect[]> => await db.select().from(users);

// Fetches/finds a user by their unique ID.
export const findUserById = async (id: number): Promise<UserSelect | null> =>
	(await db.select().from(users).where(eq(users.id, id)).limit(1))[0] ?? null;

// Fetches/finds a user by their unique username.
export const findByUsername = async (username: string): Promise<UserSelect | null> =>
	(await db.select().from(users).where(eq(users.username, username)).limit(1))[0] ?? null;

// Searches for users whose usernames contain the given search parameter (case-insensitive).
export const findBySearchParam = async (search: string): Promise<UserSelect[]> =>
	await db
		.select()
		.from(users)
		.where(ilike(users.username, `%${search}%`));

// Inserts/creates a new user into the database and returns the created user.
export const createUser = async (request: UserInsert) =>
	(await db.insert(users).values(request).returning())[0];
