/**
 * Worlds API: /worlds
 */
import type { ApiState, World } from "../../services/types";
import { getApiClient } from "./client";

/**
 * Fetch all worlds for the current user.
 * Supports responses as World[] or { worlds: World[] }.
 */
export async function fetchWorlds(): Promise<ApiState<World[]>> {
	try {
		const api = getApiClient();
		const res = await api.get<World[] | { worlds: World[] }>("/worlds");
		const worlds = Array.isArray(res.data) ? res.data : res.data.worlds;
		return { status: "success", data: worlds };
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

export async function deleteWorld(worldId: string): Promise<ApiState<void>> {
	try {
		const api = getApiClient();
		await api.delete(`/worlds/${worldId}`);
		return { status: "success", data: undefined };
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

export async function createWorld(world: World): Promise<ApiState<World>> {
	try {
		const api = getApiClient();
		await api.post<World>("/worlds", world);
		return {
			status: "success",
			data: world,
		};
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

export async function updateWorld(
	worldId: string,
	world: World,
): Promise<ApiState<World>> {
	try {
		const api = getApiClient();
		await api.patch<World>(`/worlds/${worldId}`, world);
		return {
			status: "success",
			data: world,
		};
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
