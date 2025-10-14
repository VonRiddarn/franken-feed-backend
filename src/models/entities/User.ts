import type { users } from "../../db/schema/users.ts";

/** Type for database insertion. */
export type UserInsert = typeof users.$inferInsert;
/** Type for database selection. */
export type UserSelect = typeof users.$inferSelect;

// Username and password restrictions / rules.
export const USERNAME_LENGTH_MIN = 6 as const;
export const USERNAME_LENGTH_MAX = 28 as const;

// Password rules are based on:
// https://pages.nist.gov/800-63-4/sp800-63b/passwords/
// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
export const PASSWORD_LENGTH_MIN = 8;
export const PASSWORD_LENGTH_MAX = 64;
