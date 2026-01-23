/**
 * Provider Context
 * 
 * This context provides access to all service providers throughout the application.
 * Components can use this context to access API client, auth service, etc.
 */
import React, { createContext, useContext, useMemo } from "react";
import { IApiClient } from "../services/api-client.interface";
import { IAuthService } from "../services/auth.interface";
import {
	getProviderConfig,
	createApiClient,
	createAuthService,
} from "../config/providers";

interface ProviderContextValue {
	apiClient: IApiClient;
	authService: IAuthService;
}

const ProviderContext = createContext<ProviderContextValue | undefined>(undefined);

interface ProviderContextProviderProps {
	children: React.ReactNode;
	/**
	 * Optional: Override providers for testing or custom setup
	 */
	apiClient?: IApiClient;
	authService?: IAuthService;
}

export function ProviderContextProvider({
	children,
	apiClient: overrideApiClient,
	authService: overrideAuthService,
}: ProviderContextProviderProps) {
	const config = useMemo(() => getProviderConfig(), []);

	const apiClient = useMemo(() => {
		if (overrideApiClient) {
			return overrideApiClient;
		}
		return createApiClient(config.apiClient, config.apiBaseUrl);
	}, [config.apiClient, config.apiBaseUrl, overrideApiClient]);

	const authService = useMemo(() => {
		if (overrideAuthService) {
			return overrideAuthService;
		}
		return createAuthService(config.auth);
	}, [config.auth, overrideAuthService]);

	const value = useMemo(
		() => ({
			apiClient,
			authService,
		}),
		[apiClient, authService]
	);

	return (
		<ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>
	);
}

/**
 * Hook to access providers from context
 */
export function useProviders(): ProviderContextValue {
	const context = useContext(ProviderContext);
	if (context === undefined) {
		throw new Error("useProviders must be used within a ProviderContextProvider");
	}
	return context;
}

/**
 * Hook to access API client
 */
export function useApiClient(): IApiClient {
	const { apiClient } = useProviders();
	return apiClient;
}

/**
 * Hook to access auth service
 */
export function useAuthService(): IAuthService {
	const { authService } = useProviders();
	return authService;
}
