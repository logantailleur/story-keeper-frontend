/**
 * API Service Layer
 * 
 * This file provides high-level API functions that use the provider system.
 * All API calls go through the configured API client provider.
 */
import { IApiClient } from "../services/api-client.interface";
import { ApiState, ApiResponse } from "../services/types";

// Re-export types for backward compatibility
export type { ApiState, ApiResponse };

/**
 * Fetch health check endpoint
 */
export async function fetchHealth(
	apiClient: IApiClient
): Promise<ApiState<{ status: string; timestamp?: string }>> {
	try {
		const response = await apiClient.get<{ status: string; timestamp?: string }>(
			"/health"
		);

		return {
			status: "success",
			data: response.data,
		};
	} catch (error) {
		return {
			status: "error",
			error:
				error instanceof Error
					? error.message
					: "An unknown error occurred",
		};
	}
}

/**
 * Generic API fetch utility (for use outside React components)
 * Use the hook-based functions inside components, or pass apiClient directly
 */
export async function apiFetch<T>(
	apiClient: IApiClient,
	endpoint: string,
	options?: {
		method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
		body?: unknown;
		headers?: Record<string, string>;
	}
): Promise<{ data: T; status: number; statusText: string }> {
	const method = options?.method || "GET";
	const body = options?.body;

	let response;
	switch (method) {
		case "GET":
			response = await apiClient.get<T>(endpoint, {
				headers: options?.headers,
			});
			break;
		case "POST":
			response = await apiClient.post<T>(endpoint, body, {
				headers: options?.headers,
			});
			break;
		case "PUT":
			response = await apiClient.put<T>(endpoint, body, {
				headers: options?.headers,
			});
			break;
		case "PATCH":
			response = await apiClient.patch<T>(endpoint, body, {
				headers: options?.headers,
			});
			break;
		case "DELETE":
			response = await apiClient.delete<T>(endpoint, {
				headers: options?.headers,
			});
			break;
	}

	return response;
}
