/**
 * Fetch-based API Client Implementation
 *
 * Uses the native fetch API for HTTP requests.
 * This is the default implementation.
 */
import { IApiClient } from "../services/api-client.interface";
import { ApiResponse, RequestOptions } from "../services/types";
import { getStoredJwt } from "../utils/jwt";

export class FetchApiClient implements IApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
	}

	getBaseUrl(): string {
		return this.baseUrl;
	}

	async get<T>(
		endpoint: string,
		options?: RequestOptions,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: "GET",
		});
	}

	async post<T>(
		endpoint: string,
		data?: unknown,
		options?: RequestOptions,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put<T>(
		endpoint: string,
		data?: unknown,
		options?: RequestOptions,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async patch<T>(
		endpoint: string,
		data?: unknown,
		options?: RequestOptions,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T>(
		endpoint: string,
		options?: RequestOptions,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: "DELETE",
		});
	}

	async request<T>(
		endpoint: string,
		options?: RequestOptions,
	): Promise<ApiResponse<T>> {
		const url = `${this.baseUrl}${
			endpoint.startsWith("/") ? endpoint : `/${endpoint}`
		}`;

		const { body, ...fetchOptions } = options || {};

		const headers = new Headers(fetchOptions.headers);
		const jwt = getStoredJwt();
		if (jwt && !headers.has("Authorization")) {
			headers.set("Authorization", `Bearer ${jwt}`);
		}

		// Only set JSON content-type when not already provided and body isn't FormData/Blob.
		const isBodyPresent = body !== undefined && body !== null;
		const isFormData =
			typeof FormData !== "undefined" && body instanceof FormData;
		const isBlob = typeof Blob !== "undefined" && body instanceof Blob;
		if (
			isBodyPresent &&
			!isFormData &&
			!isBlob &&
			!headers.has("Content-Type")
		) {
			headers.set("Content-Type", "application/json");
		}

		const response = await fetch(url, {
			...fetchOptions,
			headers,
			body:
				typeof body === "string"
					? body
					: body
						? JSON.stringify(body)
						: undefined,
			credentials: "include", // Include credentials for cross-origin requests
		});

		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} ${response.statusText}`,
			);
		}

		const data = await response.json();

		return {
			data,
			status: response.status,
			statusText: response.statusText,
		};
	}
}
