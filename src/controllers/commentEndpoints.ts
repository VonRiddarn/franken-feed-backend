import express from "express";
import { StatusCodes } from "http-status-codes";
import { newApiResponse, newApiResponsePaginated } from "../models/dtos/ApiResponse.ts";
import * as commentService from "../services/commentService.ts";

export const COMMENTS_ROOT = "/api/comments" as const;
export const commentRouter = express.Router();

/** GET /api/comments?postId=&limit=&offset= */
commentRouter.get("/", async (req, res) => {
	const parentId = Number(req.query.postId);
	const limit = req.query.limit ? Math.min(Number(req.query.limit), 100) : 50;
	const offset = req.query.offset ? Number(req.query.offset) : 0;

	if (!Number.isInteger(parentId) || parentId <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid postId."));
	}

	try {
		const rows = await commentService.listComments(parentId, limit, offset);
		if (rows.length === 0) {
			return res.apiResponse(newApiResponse(StatusCodes.NOT_FOUND, "No comments found."));
		}
		return res.apiResponse(
			newApiResponsePaginated(StatusCodes.OK, "Found comments.", { prev: null, next: null }, rows)
		);
	} catch (err) {
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error fetching comments."));
	}
});

/** POST /api/comments  { authorId, postId, body } */
commentRouter.post("/", async (req, res) => {
	try {
		const authorId = Number(req.body?.authorId);
		if (!Number.isInteger(authorId) || authorId <= 0) {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid authorId."));
		}

		const parentId = Number(req.body?.postId);
		const created = await commentService.createComment(authorId, parentId, req.body?.body);
		return res.apiResponse(newApiResponse(StatusCodes.CREATED, "Comment created.", created));
	} catch (err: any) {
		const msg = String(err?.message || "");
		if (msg === "INVALID_PARENT") {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid postId."));
		}
		if (msg === "PARENT_NOT_FOUND") {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Parent post not found."));
		}
		if (msg === "EMPTY_BODY") {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Body is required."));
		}
		if (msg === "INVALID_AUTHOR") {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid authorId."));
		}
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating comment."));
	}
});

/** PATCH /api/comments/:id  { authorId, body } */
commentRouter.patch("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid comment id."));
	}

	try {
		const authorId = Number(req.body?.authorId);
		if (!Number.isInteger(authorId) || authorId <= 0) {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid authorId."));
		}

		const updated = await commentService.editComment(id, authorId, req.body?.body);
		return res.apiResponse(newApiResponse(StatusCodes.OK, "Comment updated.", updated));
	} catch (err: any) {
		const msg = String(err?.message || "");
		if (msg === "EMPTY_BODY") {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Body is required."));
		}
		if (msg === "NOT_ALLOWED_OR_NOT_FOUND") {
			return res.apiResponse(
				newApiResponse(StatusCodes.FORBIDDEN, "Not allowed or comment not found.")
			);
		}
		if (msg === "INVALID_AUTHOR") {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid authorId."));
		}
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error updating comment."));
	}
});

/** DELETE /api/comments/:id  { authorId } */
commentRouter.delete("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid comment id."));
	}

	try {
		const authorId = Number(req.body?.authorId);
		if (!Number.isInteger(authorId) || authorId <= 0) {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid authorId."));
		}

		const ok = await commentService.deleteComment(id, authorId);
		if (!ok) {
			return res.apiResponse(
				newApiResponse(StatusCodes.FORBIDDEN, "Not allowed or comment not found.")
			);
		}
		return res.apiResponse(newApiResponse(StatusCodes.OK, "Comment deleted.", null));
	} catch (err) {
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error deleting comment."));
	}
});
