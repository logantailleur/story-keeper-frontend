# How to Change Provider Settings

This guide explains how to switch between different providers for API clients and authentication services in your application.

## Quick Start

Provider settings are controlled via environment variables in your `.env.local` file. Simply update the values and restart your development server.

## Environment Variables

### Required Variables

```bash
# Backend API base URL
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Optional Provider Variables

```bash
# API Client Provider (default: "fetch")
VITE_API_CLIENT_PROVIDER=fetch

# Authentication Provider (default: "mock")
VITE_AUTH_PROVIDER=mock
```

## Changing API Client Provider

The API client handles all HTTP requests to your backend. Currently supported providers:

- `fetch` (default) - Uses native browser fetch API
- `axios` - Requires implementation (see below)
- `custom` - Requires implementation (see below)

### To Switch to Fetch (Default)

```bash
# In .env.local
VITE_API_CLIENT_PROVIDER=fetch
```

No additional setup required. This is the default provider.

### To Switch to Axios

1. **Install axios**:
```bash
npm install axios
```

2. **Create the provider** (`src/providers/axios-api-client.ts`):
```typescript
import { IApiClient } from "../services/api-client.interface";
import { ApiResponse, RequestOptions } from "../services/types";
import axios, { AxiosInstance } from "axios";

export class AxiosApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({ 
      baseURL: baseUrl,
      withCredentials: true,
    });
  }

  getBaseUrl(): string {
    return this.client.defaults.baseURL || "";
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(endpoint, options);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(endpoint, data, options);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(endpoint, data, options);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(endpoint, data, options);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(endpoint, options);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async request<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const response = await this.client.request<T>({
      url: endpoint,
      ...options,
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }
}
```

3. **Update the factory** (`src/config/providers.ts`):
```typescript
import { AxiosApiClient } from "../providers/axios-api-client";

export function createApiClient(provider: ApiClientProvider, baseUrl: string): IApiClient {
  switch (provider) {
    case "fetch":
      return new FetchApiClient(baseUrl);
    case "axios":
      return new AxiosApiClient(baseUrl);  // Add this line
    // ...
  }
}
```

4. **Set the environment variable**:
```bash
VITE_API_CLIENT_PROVIDER=axios
```

5. **Restart your dev server**:
```bash
npm run dev
```

## Changing Authentication Provider

The authentication provider handles user authentication. Currently supported providers:

- `mock` (default) - Mock implementation for development/testing
- `firebase` - Requires implementation (see below)
- `auth0` - Requires implementation (see below)
- `supabase` - Requires implementation (see below)
- `custom` - Requires implementation (see below)

### To Switch to Mock (Default)

```bash
# In .env.local
VITE_AUTH_PROVIDER=mock
```

No additional setup required. This is the default provider.

### To Switch to Firebase

1. **Install Firebase**:
```bash
npm install firebase
```

2. **Create the provider** (`src/providers/firebase-auth-service.ts`):
```typescript
import { IAuthService, User, AuthResult } from "../services/auth.interface";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

export class FirebaseAuthService implements IAuthService {
  private auth = getAuth();

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return {
        success: true,
        user: this.mapFirebaseUser(userCredential.user),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  }

  async signUp(
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return {
        success: true,
        user: this.mapFirebaseUser(userCredential.user),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
  }

  async getCurrentUser(): Promise<User | null> {
    return this.auth.currentUser ? this.mapFirebaseUser(this.auth.currentUser) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.auth.currentUser !== null;
  }

  async getToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken() || null;
  }

  async refreshToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken(true) || null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(this.auth, (firebaseUser) => {
      callback(firebaseUser ? this.mapFirebaseUser(firebaseUser) : null);
    });
  }

  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || undefined,
      metadata: {
        emailVerified: firebaseUser.emailVerified,
        photoURL: firebaseUser.photoURL,
      },
    };
  }
}
```

3. **Update the factory** (`src/config/providers.ts`):
```typescript
import { FirebaseAuthService } from "../providers/firebase-auth-service";

export function createAuthService(provider: AuthProvider): IAuthService {
  switch (provider) {
    case "mock":
      return new MockAuthService();
    case "firebase":
      return new FirebaseAuthService();  // Add this line
    // ...
  }
}
```

4. **Set the environment variable**:
```bash
VITE_AUTH_PROVIDER=firebase
```

5. **Restart your dev server**:
```bash
npm run dev
```

## Changing Backend URL

To change the backend API URL:

1. **Update `.env.local`**:
```bash
VITE_API_BASE_URL=https://your-new-backend.com/api
```

2. **Restart your dev server**:
```bash
npm run dev
```

## Complete Example `.env.local`

```bash
# Backend Configuration
VITE_API_BASE_URL=https://story-keeper-backend.onrender.com/api

# Provider Selection
VITE_API_CLIENT_PROVIDER=fetch
VITE_AUTH_PROVIDER=mock
```

## Verifying Changes

After changing provider settings:

1. **Restart the development server** (required for environment variable changes):
```bash
npm run dev
```

2. **Check the browser console** for any errors

3. **Test the functionality**:
   - For API client: Make an API call and verify it works
   - For auth: Try signing in/out and verify the behavior

## Troubleshooting

### Provider Not Found Error

If you see an error like "Unknown API client provider: xyz":

1. Check that the provider name matches exactly (case-sensitive)
2. Verify the provider is implemented in `src/config/providers.ts`
3. Ensure the environment variable is set correctly in `.env.local`

### Environment Variables Not Loading

1. Make sure variables are prefixed with `VITE_`
2. Restart the dev server after changing `.env.local`
3. Check that `.env.local` is in the project root (same directory as `package.json`)

### Provider Implementation Missing

If you see "Provider not implemented" error:

1. Create the provider implementation file in `src/providers/`
2. Update the factory function in `src/config/providers.ts`
3. Ensure the provider class implements the correct interface

## Need Help?

- See `PROVIDER_ARCHITECTURE.md` for detailed architecture documentation
- Check the provider implementation files in `src/providers/` for examples
- Review the service interfaces in `src/services/` to understand the contracts
