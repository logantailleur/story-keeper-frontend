import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../services/auth.interface";
import {
	getApiClient,
	getAuthService,
	getStoredJwt,
	setStoredJwt,
} from "../utils/api";

interface AuthContextValue {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	signIn(email: string, password: string): Promise<void>;
	signUp(
		email: string,
		password: string,
		metadata?: Record<string, unknown>,
	): Promise<void>;
	signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const apiClient = getApiClient();
	const authService = getAuthService();
	const navigate = useNavigate();
	const location = useLocation();

	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(() => getStoredJwt());
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
		Boolean(getStoredJwt()),
	);

	const redirectToLogin = useCallback(() => {
		if (location.pathname === "/login") return;
		navigate("/login", { replace: true });
	}, [location.pathname, navigate]);

	useEffect(() => {
		let cancelled = false;

		async function bootstrap() {
			const stored = getStoredJwt();
			if (!stored) {
				if (!cancelled) {
					setToken(null);
					setUser(null);
					setIsAuthenticated(false);
				}
				return;
			}

			if (!cancelled) {
				setToken(stored);
				setIsAuthenticated(true);
			}

			try {
				const me = await apiClient.get<User>("/me");
				if (!cancelled) setUser(me.data);
			} catch {
				setStoredJwt(null);
				if (!cancelled) {
					setToken(null);
					setUser(null);
					setIsAuthenticated(false);
					redirectToLogin();
				}
			}
		}

		void bootstrap();
		return () => {
			cancelled = true;
		};
	}, [apiClient, redirectToLogin]);

	const signIn = useCallback(
		async (email: string, password: string) => {
			const result = await authService.signIn(email, password);
			if (!result.success) {
				throw new Error(result.error || "Login failed");
			}
			const nextToken = await authService.getToken();
			setStoredJwt(nextToken);
			if (result.user) {
				setUser(result.user);
			} else {
				const me = await apiClient.get<User>("/me");
				setUser(me.data);
			}
			setToken(nextToken);
			setIsAuthenticated(true);
		},
		[apiClient, authService],
	);

	const signUp = useCallback(
		async (
			email: string,
			password: string,
			metadata?: Record<string, unknown>,
		) => {
			const result = await authService.signUp(email, password, metadata);
			if (!result.success) {
				throw new Error(result.error || "Registration failed");
			}
			const nextToken = await authService.getToken();
			setStoredJwt(nextToken);
			if (result.user) {
				setUser(result.user);
			} else {
				const me = await apiClient.get<User>("/me");
				setUser(me.data);
			}
			setToken(nextToken);
			setIsAuthenticated(true);
		},
		[apiClient, authService],
	);

	const signOut = useCallback(async () => {
		await authService.signOut();
		setStoredJwt(null);
		setUser(null);
		setToken(null);
		setIsAuthenticated(false);
		redirectToLogin();
	}, [authService, redirectToLogin]);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			token,
			isAuthenticated,
			signIn,
			signUp,
			signOut,
		}),
		[user, token, isAuthenticated, signIn, signUp, signOut],
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components -- useAuth is the public hook for AuthProvider
export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}
