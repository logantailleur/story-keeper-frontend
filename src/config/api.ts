/**
 * API configuration.
 * Base URL comes from VITE_API_BASE_URL.
 */

export function getApiBaseUrl(): string {
	const url = import.meta.env.VITE_API_BASE_URL;
	if (!url) {
		throw new Error(
			"VITE_API_BASE_URL is not set. Add it to .env (e.g. VITE_API_BASE_URL=https://your-backend.onrender.com/api)",
		);
	}
	return url;
}
