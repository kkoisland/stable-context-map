import type { StorageState } from "./types";

const STORAGE_KEY = "stable-context-map-state";

/**
 * Save state to localStorage
 */
export const saveState = (state: StorageState): void => {
	try {
		const serialized = JSON.stringify(state);
		localStorage.setItem(STORAGE_KEY, serialized);
	} catch (error) {
		console.error("Failed to save state to localStorage:", error);
	}
};

/**
 * Load state from localStorage
 */
export const loadState = (): StorageState | null => {
	try {
		const serialized = localStorage.getItem(STORAGE_KEY);
		if (serialized === null) return null;
		return JSON.parse(serialized) as StorageState;
	} catch (error) {
		console.error("Failed to load state from localStorage:", error);
		return null;
	}
};

/**
 * Clear state from localStorage
 */
export const clearState = (): void => {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear state from localStorage:", error);
	}
};
