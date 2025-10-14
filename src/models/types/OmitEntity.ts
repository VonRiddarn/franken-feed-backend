export type OmitEntity<T, K extends keyof T = never> = Omit<T, K | "id" | "updatedAt" | "createdAt">;

// Used when updating entities in the database, eg:
// Update(e: OmitEntityPartial<User>) -- removes metadata that shouldn't be touched.
export type OmitEntityPatrial<T, K extends keyof T = never> = Partial<
	Omit<T, K | "id" | "updatedAt" | "createdAt">
>;
