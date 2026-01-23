/**
 * Mock Authentication Service Implementation
 * 
 * This is a placeholder implementation for development/testing.
 * Replace this with your actual auth provider implementation.
 */
import { IAuthService, User, AuthResult } from "../services/auth.interface";

export class MockAuthService implements IAuthService {
	private currentUser: User | null = null;
	private listeners: Array<(user: User | null) => void> = [];

	async signIn(email: string, password: string): Promise<AuthResult> {
		// Mock implementation - replace with actual auth logic
		if (email && password) {
			this.currentUser = {
				id: "1",
				email,
				name: email.split("@")[0],
			};
			this.notifyListeners(this.currentUser);
			return { success: true, user: this.currentUser };
		}
		return { success: false, error: "Invalid credentials" };
	}

	async signUp(
		email: string,
		password: string,
		metadata?: Record<string, unknown>
	): Promise<AuthResult> {
		// Mock implementation - replace with actual auth logic
		if (email && password) {
			this.currentUser = {
				id: "1",
				email,
				name: email.split("@")[0],
				metadata,
			};
			this.notifyListeners(this.currentUser);
			return { success: true, user: this.currentUser };
		}
		return { success: false, error: "Invalid credentials" };
	}

	async signOut(): Promise<void> {
		this.currentUser = null;
		this.notifyListeners(null);
	}

	async getCurrentUser(): Promise<User | null> {
		return this.currentUser;
	}

	async isAuthenticated(): Promise<boolean> {
		return this.currentUser !== null;
	}

	async getToken(): Promise<string | null> {
		return this.currentUser ? "mock-token" : null;
	}

	async refreshToken(): Promise<string | null> {
		return this.currentUser ? "mock-token-refreshed" : null;
	}

	onAuthStateChanged(callback: (user: User | null) => void): () => void {
		this.listeners.push(callback);
		// Immediately call with current state
		callback(this.currentUser);
		// Return unsubscribe function
		return () => {
			this.listeners = this.listeners.filter((listener) => listener !== callback);
		};
	}

	private notifyListeners(user: User | null): void {
		this.listeners.forEach((listener) => listener(user));
	}
}
