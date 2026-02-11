import type { ApiState, Event } from "../../services/types";
import { getApiClient } from "./client";

export async function fetchEvents(worldId: string): Promise<ApiState<Event[]>> {
	try {
		const api = getApiClient();
		const res = await api.get<Event[] | { events: Event[] }>(
			`/events?worldId=${worldId}`,
		);
		const events = Array.isArray(res.data) ? res.data : res.data.events;
		return { status: "success", data: events };
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

export async function createEvent(event: Event): Promise<ApiState<Event>> {
	try {
		const api = getApiClient();
		const res = await api.post<Event>("/events", event);
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

export async function updateEvent(
	eventId: string,
	event: Event,
): Promise<ApiState<Event>> {
	try {
		const api = getApiClient();
		const res = await api.patch<Event>(`/events/${eventId}`, event);
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

export async function deleteEvent(eventId: string): Promise<ApiState<void>> {
	try {
		const api = getApiClient();
		await api.delete<void>(`/events/${eventId}`);
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

export async function fetchEventById(
	eventId: string,
): Promise<ApiState<Event>> {
	try {
		const api = getApiClient();
		const res = await api.get<Event>(`/events/${eventId}`);
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
