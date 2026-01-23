# Provider Architecture Guide

This application uses a modular provider architecture that allows you to easily switch between different service providers (API clients, authentication, etc.) without overhauling your codebase.

## Architecture Overview

```
src/
├── services/              # Service interfaces (contracts)
│   ├── api-client.interface.ts
│   ├── auth.interface.ts
│   └── types.ts
├── providers/            # Provider implementations
│   ├── fetch-api-client.ts
│   └── mock-auth-service.ts
├── config/               # Configuration and factory functions
│   └── providers.ts
├── contexts/             # React context for dependency injection
│   └── ProviderContext.tsx
└── utils/                # High-level API functions
    └── api.ts
```

## How It Works

1. **Service Interfaces**: Define contracts that all providers must implement
2. **Provider Implementations**: Concrete implementations for different services
3. **Configuration**: Environment-based provider selection
4. **Context**: React context provides providers throughout the app
5. **API Layer**: High-level functions that use the providers

## Switching Providers

### Switching API Client Provider

1. **Create a new provider** (e.g., `src/providers/axios-api-client.ts`):
```typescript
import { IApiClient } from "../services/api-client.interface";
import { ApiResponse, RequestOptions } from "../services/types";
import axios, { AxiosInstance } from "axios";

export class AxiosApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({ baseURL: baseUrl });
  }

  getBaseUrl(): string {
    return this.client.defaults.baseURL || "";
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(endpoint, { ...options });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }
  
  // ... implement other methods
}
```

2. **Update `src/config/providers.ts`**:
```typescript
import { AxiosApiClient } from "../providers/axios-api-client";

export function createApiClient(provider: ApiClientProvider, baseUrl: string): IApiClient {
  switch (provider) {
    case "fetch":
      return new FetchApiClient(baseUrl);
    case "axios":
      return new AxiosApiClient(baseUrl);  // Add this
    // ...
  }
}
```

3. **Set environment variable**:
```bash
VITE_API_CLIENT_PROVIDER=axios
```

### Switching Auth Provider

1. **Create a new provider** (e.g., `src/providers/firebase-auth-service.ts`):
```typescript
import { IAuthService, User, AuthResult } from "../services/auth.interface";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export class FirebaseAuthService implements IAuthService {
  private auth = getAuth();

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return {
        success: true,
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  }
  
  // ... implement other methods
}
```

2. **Update `src/config/providers.ts`**:
```typescript
import { FirebaseAuthService } from "../providers/firebase-auth-service";

export function createAuthService(provider: AuthProvider): IAuthService {
  switch (provider) {
    case "mock":
      return new MockAuthService();
    case "firebase":
      return new FirebaseAuthService();  // Add this
    // ...
  }
}
```

3. **Set environment variable**:
```bash
VITE_AUTH_PROVIDER=firebase
```

## Using Providers in Components

### Using API Client

```typescript
import { useApiClient } from "../contexts/ProviderContext";
import { fetchHealth } from "../utils/api";

function MyComponent() {
  const apiClient = useApiClient();
  
  useEffect(() => {
    const loadData = async () => {
      const result = await fetchHealth(apiClient);
      // Handle result
    };
    loadData();
  }, [apiClient]);
}
```

### Using Auth Service

```typescript
import { useAuthService } from "../contexts/ProviderContext";

function LoginComponent() {
  const authService = useAuthService();
  
  const handleLogin = async () => {
    const result = await authService.signIn(email, password);
    if (result.success) {
      // Handle success
    }
  };
}
```

## Environment Variables

Add these to your `.env.local` file:

```bash
# Required
VITE_API_BASE_URL=https://your-backend.onrender.com/api

# Optional (defaults shown)
VITE_API_CLIENT_PROVIDER=fetch
VITE_AUTH_PROVIDER=mock
```

## Benefits

1. **Easy Provider Switching**: Change providers via environment variables
2. **Testability**: Mock providers for testing
3. **Type Safety**: Interfaces ensure all providers implement the same contract
4. **Separation of Concerns**: Business logic is separate from provider implementations
5. **Future-Proof**: Add new providers without changing existing code

## Adding New Service Types

To add a new service type (e.g., storage service):

1. Create interface: `src/services/storage.interface.ts`
2. Create implementations: `src/providers/local-storage-service.ts`, etc.
3. Add to `ProviderContext.tsx`
4. Update `config/providers.ts` with factory function
5. Export hooks from `ProviderContext.tsx`
