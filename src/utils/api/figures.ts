import type { ApiState, Figure } from "../../services/types";
import { getApiClient } from "./client";

export interface FiguresPaginatedResponse {
	figures: Figure[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export async function fetchFigures(
	worldId: string,
	options?: { page?: number; limit?: number; search?: string },
): Promise<ApiState<FiguresPaginatedResponse>> {
	try {
		const api = getApiClient();
		const params = new URLSearchParams({ worldId });
		
		if (options?.page !== undefined) {
			params.append("page", options.page.toString());
		}
		if (options?.limit !== undefined) {
			params.append("limit", options.limit.toString());
		}
		if (options?.search) {
			params.append("search", options.search);
		}
		
		const res = await api.get<FiguresPaginatedResponse>(
			`/figures?${params.toString()}`,
		);
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

export async function createFigure(figure: Figure): Promise<ApiState<Figure>> {
	try {
		const api = getApiClient();
		const res = await api.post<Figure>("/figures", figure);
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

export async function updateFigure(
	figureId: string,
	figure: Figure,
): Promise<ApiState<Figure>> {
	try {
		const api = getApiClient();
		const res = await api.patch<Figure>(`/figures/${figureId}`, figure);
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

export async function deleteFigure(figureId: string): Promise<ApiState<void>> {
	try {
		const api = getApiClient();
		await api.delete<void>(`/figures/${figureId}`);
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

export async function fetchFigureById(
	figureId: string,
): Promise<ApiState<Figure>> {
	try {
		const api = getApiClient();
		const res = await api.get<Figure>(`/figures/${figureId}`);
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

export async function linkFigureEvent(
	figureId: string,
	eventId: string,
): Promise<ApiState<Figure>> {
	try {
		const api = getApiClient();
		const res = await api.post<Figure>(
			`/figures/${figureId}/events/${eventId}`,
		);
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

export async function unlinkFigureEvent(
	figureId: string,
	eventId: string,
): Promise<ApiState<Figure>> {
	try {
		const api = getApiClient();
		const res = await api.delete<Figure>(
			`/figures/${figureId}/events/${eventId}`,
		);
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
