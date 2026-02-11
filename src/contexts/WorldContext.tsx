import {
	createContext,
	useContext,
	type ReactNode,
} from "react";

interface WorldContextValue {
	worldId: string;
	setWorldId: (id: string) => void;
}

const WorldContext = createContext<WorldContextValue | undefined>(undefined);

export function WorldProvider({
	worldId,
	setWorldId,
	children,
}: WorldContextValue & { children: ReactNode }) {
	return (
		<WorldContext.Provider value={{ worldId, setWorldId }}>
			{children}
		</WorldContext.Provider>
	);
}

export function useWorld(): WorldContextValue {
	const ctx = useContext(WorldContext);
	if (ctx === undefined) {
		throw new Error("useWorld must be used within a WorldProvider");
	}
	return ctx;
}
