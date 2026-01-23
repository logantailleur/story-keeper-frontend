/**
 * Common types and interfaces for services
 */

export type ApiState<T> =
	| { status: "loading" }
	| { status: "success"; data: T }
	| { status: "error"; error: string };

export interface ApiResponse<T> {
	data: T;
	status: number;
	statusText: string;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
	body?: unknown; // Allow any serializable type
}
