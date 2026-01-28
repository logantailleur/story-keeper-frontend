/**
 * Authentication service contract.
 * The app uses API-backed auth (login/register → JWT) via ApiAuthService.
 */
export interface IAuthService {
	/**
	 * Sign in a user
	 */
	signIn(email: string, password: string): Promise<AuthResult>;

	/**
	 * Sign up a new user
	 */
	signUp(
		email: string,
		password: string,
		metadata?: Record<string, unknown>,
	): Promise<AuthResult>;

	/**
	 * Sign out the current user
	 */
	signOut(): Promise<void>;

	/**
	 * Get the current user
	 */
	getCurrentUser(): Promise<User | null>;

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): Promise<boolean>;

	/**
	 * Get the authentication token
	 */
	getToken(): Promise<string | null>;

	/**
	 * Refresh the authentication token
	 */
	refreshToken(): Promise<string | null>;

	/**
	 * Subscribe to authentication state changes
	 */
	onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

export interface User {
	id: string;
	email: string;
	name?: string;
	metadata?: Record<string, unknown>;
}

export interface AuthResult {
	success: boolean;
	user?: User;
	error?: string;
}
