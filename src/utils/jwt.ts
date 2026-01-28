/**
 * JWT storage for API auth.
 * The API client attaches the stored token to requests automatically.
 */

export const AUTH_TOKEN_STORAGE_KEY = "sk_jwt";

export function getStoredJwt(): string | null {
	try {
		if (typeof window === "undefined") return null;
		return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
	} catch {
		return null;
	}
}

export function setStoredJwt(token: string | null): void {
	try {
		if (typeof window === "undefined") return;
		if (!token) {
			window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
			return;
		}
		window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
	} catch {
		// ignore storage failures (e.g. private mode)
	}
}
