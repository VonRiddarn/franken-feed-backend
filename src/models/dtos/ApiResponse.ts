import { StatusCodes } from "http-status-codes";

export type ApiResponsePagination = {
	prev: string | null; // API Endpoint
	next: string | null; // API Endpoint
};

export type ApiResponse<T> = {
	status: StatusCodes;
	message: string;
	pagination: ApiResponsePagination | null;
	data: T | null;
};

export const newApiResponse = <T>(
	status: StatusCodes,
	message: string,
	data: T | null = null
): ApiResponse<T> => ({
	status,
	message,
	pagination: null,
	data,
});

export const newApiResponsePaginated = <T>(
	status: StatusCodes,
	message: string,
	pagination: ApiResponsePagination,
	data: T | null = null
): ApiResponse<T> => ({
	status,
	message,
	pagination,
	data,
});
