/**
 * API layer: client, path-scoped fetchers, and re-exports.
 * Import from here for backward compatibility.
 */
export { apiFetch, getApiClient, getAuthService } from "./client";
export { fetchHealth } from "./health";
export { createWorld, deleteWorld, fetchWorlds } from "./worlds";

export { AUTH_TOKEN_STORAGE_KEY, getStoredJwt, setStoredJwt } from "../jwt";

export type { ApiResponse, ApiState, World } from "../../services/types";
