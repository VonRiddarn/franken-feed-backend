import express from "express";
import * as userService from "../services/userService.ts";
import { newApiResponse } from "../models/dtos/ApiResponse.ts";
import { StatusCodes } from "http-status-codes";

export const USERS_ROOT = "/api/users" as const;
export const userRouter = express.Router();

/** GET /api/users?search=foo
 * If ?search exists, searches usernames
 * Otherwise, lists all users
 */
userRouter.get("/", async (req, res) => {
	const searchParam = req.query.search as string | undefined;

	try {
		const userDTO = searchParam
			? await userService.getUserBySearchParam(searchParam)
			: await userService.getUsersAll();

		if (!userDTO || userDTO.length === 0) {
			return res.apiResponse(newApiResponse(StatusCodes.NOT_FOUND, "No users found."));
		}

		return res.apiResponse(newApiResponse(StatusCodes.OK, "Found users.", userDTO));
	} catch (err) {
		console.error(err);
		return res.apiResponse(
			newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error fetching users from database.")
		);
	}
});

/** GET /api/users/:username?nodata=true
 * Fetch user by username
 * If ?nodata=true, returns no user data (for checking existence only)
 */
userRouter.get("/:username", async (req, res) => {
	const username = (req.params.username ?? "").trim();
	const nodata = ((req.query.nodata as string) ?? "").trim().toLowerCase() === "true";

	try {
		const userDTO = await userService.getUserByUsername(username);

		if (!userDTO) {
			return res.apiResponse(newApiResponse(StatusCodes.NOT_FOUND, "User not found."));
		}

		return res.apiResponse(newApiResponse(StatusCodes.OK, "User found.", nodata ? null : userDTO));
	} catch (err) {
		console.error(err);
		return res.apiResponse(
			newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error fetching user from database.")
		);
	}
});
