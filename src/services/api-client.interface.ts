/**
 * API client contract. The app uses FetchApiClient (native fetch).
 */
import { ApiResponse, RequestOptions } from "./types";

export interface IApiClient {
	/**
	 * Get the base URL for API requests
	 */
	getBaseUrl(): string;

	/**
	 * Make a GET request
	 */
	get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;

	/**
	 * Make a POST request
	 */
	post<T>(
		endpoint: string,
		data?: unknown,
		options?: RequestOptions,
	): Promise<ApiResponse<T>>;

	/**
	 * Make a PUT request
	 */
	put<T>(
		endpoint: string,
		data?: unknown,
		options?: RequestOptions,
	): Promise<ApiResponse<T>>;

	/**
	 * Make a PATCH request
	 */
	patch<T>(
		endpoint: string,
		data?: unknown,
		options?: RequestOptions,
	): Promise<ApiResponse<T>>;

	/**
	 * Make a DELETE request
	 */
	delete<T>(
		endpoint: string,
		options?: RequestOptions,
	): Promise<ApiResponse<T>>;

	/**
	 * Make a generic request
	 */
	request<T>(
		endpoint: string,
		options?: RequestOptions,
	): Promise<ApiResponse<T>>;
}
