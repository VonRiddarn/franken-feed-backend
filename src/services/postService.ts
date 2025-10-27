import * as repo from "../repositories/postRepository.ts";
import type { PostSelect } from "../models/entities/posts.ts";

export const listPosts = repo.findAllPosts;
export const getPostById = repo.findPostById;

export const createPost = async (
	authorId: number,
	body: unknown,
	parentId?: unknown
): Promise<PostSelect> => {
	const text = String(body ?? "").trim();
	if (!text) throw new Error("EMPTY_BODY");

	const pid = parentId == null ? null : Number(parentId);
	if (pid !== null) throw new Error("USE_COMMENTS_API");

	const [row] = await (await import("../repositories/postRepository.ts"))
		.insertPost(authorId, text, null)
		.then((r) => [r]);
	if (!row) throw new Error("INSERT_FAILED");
	return row;
};

export const editPost = async (postId: number, authorId: number, body: unknown): Promise<PostSelect> => {
	const text = String(body ?? "").trim();
	if (!text) throw new Error("EMPTY_BODY");
	const row = await repo.updatePostBodyByAuthor(postId, authorId, text);
	if (!row) throw new Error("NOT_ALLOWED_OR_NOT_FOUND");
	return row;
};

export const deletePost = async (postId: number, authorId: number): Promise<boolean> => {
	const res = await repo.deletePostByIdAndAuthor(postId, authorId);
	return res.length > 0;
};
