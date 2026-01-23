/**
 * API utility for making HTTP requests
 */

export type ApiState<T> =
	| { status: "loading" }
	| { status: "success"; data: T }
	| { status: "error"; error: string };

export interface ApiResponse<T> {
	data: T;
	status: number;
	statusText: string;
}

/**
 * Get the base API URL from environment variables
 * Reads from VITE_API_BASE_URL (must be prefixed with VITE_ for Vite to expose it)
 * Expected format: https://your-backend.onrender.com/api (include /api if backend routes are under /api)
 * @throws Error if VITE_API_BASE_URL is not set
 */
function getBaseUrl(): string {
	const baseUrl = import.meta.env.VITE_API_BASE_URL;
	if (!baseUrl) {
		throw new Error(
			"VITE_API_BASE_URL environment variable is not set. " +
				"Please create a .env file with VITE_API_BASE_URL=<your-backend-url>"
		);
	}
	return baseUrl.replace(/\/$/, ""); // Remove trailing slash if present
}

/**
 * Fetch health check endpoint
 * @returns Promise that resolves to ApiState with health check data
 */
export async function fetchHealth(): Promise<
	ApiState<{ status: string; timestamp?: string }>
> {
	try {
		const baseUrl = getBaseUrl();
		// Base URL already includes /api, so just append /health
		const url = `${baseUrl}/health`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Include credentials for cross-origin requests
		});

		if (!response.ok) {
			return {
				status: "error",
				error: `HTTP error! status: ${response.status} ${response.statusText}`,
			};
		}

		const data = await response.json();

		return {
			status: "success",
			data,
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
 * Generic API fetch utility
 * @param endpoint - API endpoint (e.g., '/users' or 'users')
 * Note: Do not include '/api' prefix as it's already in the base URL
 * @param options - Fetch options
 * @returns Promise with API response
 */
export async function apiFetch<T>(
	endpoint: string,
	options?: RequestInit
): Promise<ApiResponse<T>> {
	const baseUrl = getBaseUrl();
	const url = `${baseUrl}${
		endpoint.startsWith("/") ? endpoint : `/${endpoint}`
	}`;

	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
		credentials: "include", // Include credentials for cross-origin requests
	});

	if (!response.ok) {
		throw new Error(
			`HTTP error! status: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();

	return {
		data,
		status: response.status,
		statusText: response.statusText,
	};
}
