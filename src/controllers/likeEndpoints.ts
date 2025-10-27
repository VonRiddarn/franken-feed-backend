import express from "express";
import { StatusCodes } from "http-status-codes";
import { newApiResponse } from "../models/dtos/ApiResponse.ts";
import * as likeService from "../services/likeService.ts";

// We keep the URL nested for clarity but this is a separate router module
export const likeRouter = express.Router();

/** POST /api/posts/:id/likes  { userId } */
likeRouter.post("/api/posts/:id/likes", async (req, res) => {
	const userId = Number(req.body?.userId);
	if (!Number.isInteger(userId) || userId <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid userId."));
	}

	const postId = Number(req.params.id);
	if (!Number.isInteger(postId) || postId <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid post id."));
	}

	try {
		await likeService.likePost(userId, postId);
		return res.apiResponse(newApiResponse(StatusCodes.OK, "Post liked.", null));
	} catch (err) {
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error liking post."));
	}
});

/** DELETE /api/posts/:id/likes  { userId } */
likeRouter.delete("/api/posts/:id/likes", async (req, res) => {
	const userId = Number(req.body?.userId);
	if (!Number.isInteger(userId) || userId <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid userId."));
	}

	const postId = Number(req.params.id);
	if (!Number.isInteger(postId) || postId <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid post id."));
	}

	try {
		await likeService.unlikePost(userId, postId);
		return res.apiResponse(newApiResponse(StatusCodes.OK, "Like removed.", null));
	} catch (err) {
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error unliking post."));
	}
});
