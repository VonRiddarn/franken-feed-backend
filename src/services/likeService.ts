import * as repo from "../repositories/likeRepository.ts";

export const likePost = async (userId: number, postId: number) => {
	const existing = await repo.findExistingLike(userId, postId);
	if (existing) return;
	await repo.insertLike(userId, postId);
};

export const unlikePost = async (userId: number, postId: number) => {
	await repo.deleteLike(userId, postId);
};
