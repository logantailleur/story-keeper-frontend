/**
 * Health API: /health
 */
import type { ApiState } from "../../services/types";
import { getApiClient } from "./client";

export async function fetchHealth(): Promise<
	ApiState<{ status: string; timestamp?: string }>
> {
	try {
		const api = getApiClient();
		const res = await api.get<{
			status: string;
			timestamp?: string;
		}>("/health");
		return { status: "success", data: res.data };
	} catch (err) {
		return {
			status: "error",
			error:
				err instanceof Error
					? err.message
					: "An unknown error occurred",
		};
	}
}
