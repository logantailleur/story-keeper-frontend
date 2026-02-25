/**
 * Common types and interfaces for services
 */

export interface World {
	id: string;
	name: string;
	startYear: number;
	currentYear: number;
	description?: string;
}

export interface Event {
	id: string;
	title: string;
	year: number;
	description: string;
	worldId: string;
	importance?: EventImportance;
}

export type EventImportance = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export enum FigureType {
	PERSON = "PERSON",
	FACTION = "FACTION",
}

export interface Figure {
	id: string;
	name: string;
	type: FigureType;
	description: string;
	worldId: string;
	eventIds?: (string | number)[];
}

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
