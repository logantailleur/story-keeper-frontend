/**
 * API layer: single fetch-based client and helpers.
 * Base URL from VITE_API_BASE_URL; JWT attached automatically when stored.
 */
import { getApiBaseUrl } from "../config/api";
import { ApiAuthService } from "../providers/api-auth-service";
import { FetchApiClient } from "../providers/fetch-api-client";
import type { IApiClient } from "../services/api-client.interface";
import type { IAuthService } from "../services/auth.interface";
import type { ApiResponse, ApiState } from "../services/types";
import { AUTH_TOKEN_STORAGE_KEY, getStoredJwt, setStoredJwt } from "./jwt";

export { AUTH_TOKEN_STORAGE_KEY, getStoredJwt, setStoredJwt };
export type { ApiResponse, ApiState };

const apiClient: IApiClient = new FetchApiClient(getApiBaseUrl());
const authService: IAuthService = new ApiAuthService(apiClient);

export function getApiClient(): IApiClient {
	return apiClient;
}

export function getAuthService(): IAuthService {
	return authService;
}

export async function fetchHealth(): Promise<
	ApiState<{ status: string; timestamp?: string }>
> {
	try {
		const res = await apiClient.get<{
			status: string;
			timestamp?: string;
		}>("/health");
		return { status: "success", data: res.data };
	} catch (err) {
		return {
			status: "error",
			error:
				err instanceof Error
					? err.message
					: "An unknown error occurred",
		};
	}
}

export async function apiFetch<T>(
	endpoint: string,
	options?: {
		method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
		body?: unknown;
		headers?: Record<string, string>;
	},
): Promise<{ data: T; status: number; statusText: string }> {
	const method = options?.method ?? "GET";
	const body = options?.body;
	const headers = options?.headers;

	switch (method) {
		case "GET":
			return apiClient.get<T>(endpoint, { headers });
		case "POST":
			return apiClient.post<T>(endpoint, body, { headers });
		case "PUT":
			return apiClient.put<T>(endpoint, body, { headers });
		case "PATCH":
			return apiClient.patch<T>(endpoint, body, { headers });
		case "DELETE":
			return apiClient.delete<T>(endpoint, { headers });
		default:
			return apiClient.get<T>(endpoint, { headers });
	}
}
