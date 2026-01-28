/**
 * API-backed Authentication Service
 *
 * Talks to the backend endpoints:
 * - POST /login    -> { token }
 * - POST /register -> { token }
 * - GET  /me       -> current user (requires Authorization: Bearer <token>)
 */
import type { IApiClient } from "../services/api-client.interface";
import type {
	AuthResult,
	IAuthService,
	User,
} from "../services/auth.interface";

type TokenResponse = { token: string };

function errorMessageFromUnknown(err: unknown): string {
	if (err instanceof Error) return err.message;
	return "Request failed.";
}

export class ApiAuthService implements IAuthService {
	private apiClient: IApiClient;
	private token: string | null = null;
	private listeners: Array<(user: User | null) => void> = [];

	constructor(apiClient: IApiClient) {
		this.apiClient = apiClient;
	}

	async signIn(email: string, password: string): Promise<AuthResult> {
		try {
			const res = await this.apiClient.post<TokenResponse>("/login", {
				email,
				password,
			});
			this.token = res.data.token;
			// User is fetched by AuthContext after persisting token.
			this.notifyListeners(null);
			return { success: true };
		} catch (err) {
			return { success: false, error: errorMessageFromUnknown(err) };
		}
	}

	async signUp(
		email: string,
		password: string,
		_metadata?: Record<string, unknown>,
	): Promise<AuthResult> {
		void _metadata; // satisfies IAuthService; reserved for future use
		try {
			const res = await this.apiClient.post<TokenResponse>("/register", {
				email,
				password,
			});
			this.token = res.data.token;
			this.notifyListeners(null);
			return { success: true };
		} catch (err) {
			return { success: false, error: errorMessageFromUnknown(err) };
		}
	}

	async signOut(): Promise<void> {
		this.token = null;
		this.notifyListeners(null);
	}

	async getCurrentUser(): Promise<User | null> {
		try {
			const res = await this.apiClient.get<User>("/me");
			return res.data;
		} catch {
			return null;
		}
	}

	async isAuthenticated(): Promise<boolean> {
		return Boolean(this.token);
	}

	async getToken(): Promise<string | null> {
		return this.token;
	}

	async refreshToken(): Promise<string | null> {
		// Backend refresh endpoint not defined yet.
		return this.token;
	}

	onAuthStateChanged(callback: (user: User | null) => void): () => void {
		this.listeners.push(callback);
		callback(null);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== callback);
		};
	}

	private notifyListeners(user: User | null): void {
		this.listeners.forEach((l) => l(user));
	}
}
