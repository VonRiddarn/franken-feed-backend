import * as repo from "../repositories/postRepository.ts";
import type { PostSelect } from "../models/entities/posts.ts";

export const listComments = async (parentId: number, limit = 50, offset = 0): Promise<PostSelect[]> =>
	await repo.findChildren(parentId, limit, offset);

export const createComment = async (
	authorId: number,
	parentId: number,
	body: unknown
): Promise<PostSelect> => {
	if (!Number.isInteger(parentId) || parentId <= 0) throw new Error("INVALID_PARENT");
	const parent = await repo.findPostById(parentId);
	if (!parent) throw new Error("PARENT_NOT_FOUND");

	const text = String(body ?? "").trim();
	if (!text) throw new Error("EMPTY_BODY");

	const [row] = await (await import("../repositories/postRepository.ts"))
		.insertPost(authorId, text, parentId)
		.then((r) => [r]);
	if (!row) throw new Error("INSERT_FAILED");
	return row;
};

export const editComment = async (
	commentId: number,
	authorId: number,
	body: unknown
): Promise<PostSelect> => {
	const text = String(body ?? "").trim();
	if (!text) throw new Error("EMPTY_BODY");
	const row = await repo.updatePostBodyByAuthor(commentId, authorId, text);
	if (!row) throw new Error("NOT_ALLOWED_OR_NOT_FOUND");
	return row;
};

export const deleteComment = async (commentId: number, authorId: number): Promise<boolean> => {
	const res = await repo.deletePostByIdAndAuthor(commentId, authorId);
	return res.length > 0;
};
