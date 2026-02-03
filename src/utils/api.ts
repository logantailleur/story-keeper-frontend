/**
 * API barrel: re-exports from utils/api/ (path-scoped modules).
 * Keeps "utils/api" resolution working for runtimes that resolve api.ts before api/index.
 */
export type { ApiResponse, ApiState, World } from "../services/types";
export { apiFetch, getApiClient, getAuthService } from "./api/client";
export { fetchHealth } from "./api/health";
export { createWorld, deleteWorld, fetchWorlds } from "./api/worlds";
export { AUTH_TOKEN_STORAGE_KEY, getStoredJwt, setStoredJwt } from "./jwt";
