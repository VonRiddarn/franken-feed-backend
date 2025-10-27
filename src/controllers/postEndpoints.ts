import express from "express";
import { StatusCodes } from "http-status-codes";
import { newApiResponse, newApiResponsePaginated } from "../models/dtos/ApiResponse.ts";
import * as postService from "../services/postService.ts";

export const POSTS_ROOT = "/api/posts" as const;
export const postRouter = express.Router();

/** GET /api/posts?search=&author=&limit=&offset=  (top-level posts only) */
postRouter.get("/", async (req, res) => {
	const rawSearch = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
	const authorNum = req.query.author ? Number(req.query.author) : undefined;
	const limit = req.query.limit ? Math.min(Number(req.query.limit), 100) : 50;
	const offset = req.query.offset ? Number(req.query.offset) : 0;

	const filters: any = { limit, offset, onlyTopLevel: true };
	if (rawSearch && rawSearch.length > 0) filters.search = rawSearch;
	if (Number.isInteger(authorNum) && authorNum! > 0) filters.authorId = authorNum;

	try {
		const rows = await postService.listPosts(filters);
		if (rows.length === 0) {
			return res.apiResponse(newApiResponse(StatusCodes.NOT_FOUND, "No posts found."));
		}
		return res.apiResponse(
			newApiResponsePaginated(StatusCodes.OK, "Found posts.", { prev: null, next: null }, rows)
		);
	} catch (err) {
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error fetching posts."));
	}
});

/** GET /api/posts/:id */
postRouter.get("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid post id."));
	}
	try {
		const post = await postService.getPostById(id);
		if (!post) return res.apiResponse(newApiResponse(StatusCodes.NOT_FOUND, "Post not found."));
		return res.apiResponse(newApiResponse(StatusCodes.OK, "Found post.", post));
	} catch (err) {
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error fetching post."));
	}
});

/** POST /api/posts  { authorId, body }  (top-level post) */
postRouter.post("/", async (req, res) => {
	try {
		const authorId = Number(req.body?.authorId);
		if (!Number.isInteger(authorId) || authorId <= 0) {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid authorId."));
		}

		const created = await postService.createPost(authorId, req.body?.body);
		return res.apiResponse(newApiResponse(StatusCodes.CREATED, "Post created.", created));
	} catch (err: any) {
		const msg = String(err?.message || "");
		if (msg === "EMPTY_BODY") {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Body is required."));
		}
		if (msg === "USE_COMMENTS_API") {
			return res.apiResponse(
				newApiResponse(StatusCodes.BAD_REQUEST, "Use /api/comments to create comments.")
			);
		}
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating post."));
	}
});

/** PATCH /api/posts/:id  { authorId, body }  (author-only) */
postRouter.patch("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid post id."));
	}

	try {
		const authorId = Number(req.body?.authorId);
		if (!Number.isInteger(authorId) || authorId <= 0) {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid authorId."));
		}

		const updated = await postService.editPost(id, authorId, req.body?.body);
		return res.apiResponse(newApiResponse(StatusCodes.OK, "Post updated.", updated));
	} catch (err: any) {
		const msg = String(err?.message || "");
		if (msg === "EMPTY_BODY") {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Body is required."));
		}
		if (msg === "NOT_ALLOWED_OR_NOT_FOUND") {
			return res.apiResponse(newApiResponse(StatusCodes.FORBIDDEN, "Not allowed or post not found."));
		}
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error updating post."));
	}
});

/** DELETE /api/posts/:id  { authorId } (author-only) */
postRouter.delete("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid post id."));
	}

	try {
		const authorId = Number(req.body?.authorId);
		if (!Number.isInteger(authorId) || authorId <= 0) {
			return res.apiResponse(newApiResponse(StatusCodes.BAD_REQUEST, "Invalid authorId."));
		}

		const ok = await postService.deletePost(id, authorId);
		if (!ok) {
			return res.apiResponse(newApiResponse(StatusCodes.FORBIDDEN, "Not allowed or post not found."));
		}
		return res.apiResponse(newApiResponse(StatusCodes.OK, "Post deleted.", null));
	} catch (err) {
		console.error(err);
		return res.apiResponse(newApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error deleting post."));
	}
});
