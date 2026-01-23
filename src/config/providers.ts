/**
 * Provider Configuration
 * 
 * This file allows you to easily switch between different provider implementations.
 * To switch providers, simply change the imports and exports here.
 */

import { IApiClient } from "../services/api-client.interface";
import { IAuthService } from "../services/auth.interface";
import { FetchApiClient } from "../providers/fetch-api-client";
import { MockAuthService } from "../providers/mock-auth-service";

/**
 * Provider types - add new provider types here as needed
 */
export type ApiClientProvider = "fetch" | "axios" | "custom";
export type AuthProvider = "mock" | "firebase" | "auth0" | "supabase" | "custom";

/**
 * Provider configuration from environment variables
 */
export interface ProviderConfig {
	apiClient: ApiClientProvider;
	auth: AuthProvider;
	apiBaseUrl: string;
}

/**
 * Get provider configuration from environment variables
 */
export function getProviderConfig(): ProviderConfig {
	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
	if (!apiBaseUrl) {
		throw new Error(
			"VITE_API_BASE_URL environment variable is not set. " +
				"Please create a .env file with VITE_API_BASE_URL=<your-backend-url>"
		);
	}

	return {
		apiClient: (import.meta.env.VITE_API_CLIENT_PROVIDER as ApiClientProvider) || "fetch",
		auth: (import.meta.env.VITE_AUTH_PROVIDER as AuthProvider) || "mock",
		apiBaseUrl,
	};
}

/**
 * Factory function to create API client based on provider type
 */
export function createApiClient(provider: ApiClientProvider, baseUrl: string): IApiClient {
	switch (provider) {
		case "fetch":
			return new FetchApiClient(baseUrl);
		case "axios":
			// Example: return new AxiosApiClient(baseUrl);
			throw new Error(
				"Axios provider not implemented. Create src/providers/axios-api-client.ts"
			);
		case "custom":
			// Example: return new CustomApiClient(baseUrl);
			throw new Error(
				"Custom provider not implemented. Create your custom provider."
			);
		default:
			throw new Error(`Unknown API client provider: ${provider}`);
	}
}

/**
 * Factory function to create auth service based on provider type
 */
export function createAuthService(provider: AuthProvider): IAuthService {
	switch (provider) {
		case "mock":
			return new MockAuthService();
		case "firebase":
			// Example: return new FirebaseAuthService();
			throw new Error(
				"Firebase provider not implemented. Create src/providers/firebase-auth-service.ts"
			);
		case "auth0":
			// Example: return new Auth0AuthService();
			throw new Error(
				"Auth0 provider not implemented. Create src/providers/auth0-auth-service.ts"
			);
		case "supabase":
			// Example: return new SupabaseAuthService();
			throw new Error(
				"Supabase provider not implemented. Create src/providers/supabase-auth-service.ts"
			);
		case "custom":
			// Example: return new CustomAuthService();
			throw new Error(
				"Custom provider not implemented. Create your custom provider."
			);
		default:
			throw new Error(`Unknown auth provider: ${provider}`);
	}
}
