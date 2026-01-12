import type { StorageList } from "./types";

const CURRENT_WORK_KEY = "stable-context-map-current";
const SAVED_LISTS_KEY = "stable-context-map-saved";

// ============================================
// Current Work (auto-saved)
// ============================================

/**
 * Save current work to localStorage
 */
export const saveCurrentWork = (work: StorageList): void => {
	try {
		const serialized = JSON.stringify(work);
		localStorage.setItem(CURRENT_WORK_KEY, serialized);
	} catch (error) {
		console.error("Failed to save current work to localStorage:", error);
	}
};

/**
 * Load current work from localStorage
 */
export const loadCurrentWork = (): StorageList | null => {
	try {
		const serialized = localStorage.getItem(CURRENT_WORK_KEY);
		if (serialized === null) return null;
		return JSON.parse(serialized) as StorageList;
	} catch (error) {
		console.error("Failed to load current work from localStorage:", error);
		return null;
	}
};

/**
 * Clear current work from localStorage
 */
export const clearCurrentWork = (): void => {
	try {
		localStorage.removeItem(CURRENT_WORK_KEY);
	} catch (error) {
		console.error("Failed to clear current work from localStorage:", error);
	}
};

// ============================================
// Saved Lists
// ============================================

/**
 * Load all saved lists from localStorage
 */
export const loadSavedLists = (): StorageList[] => {
	try {
		const serialized = localStorage.getItem(SAVED_LISTS_KEY);
		if (serialized === null) return [];
		return JSON.parse(serialized) as StorageList[];
	} catch (error) {
		console.error("Failed to load saved lists from localStorage:", error);
		return [];
	}
};

/**
 * Save all saved lists to localStorage
 */
const saveSavedLists = (lists: StorageList[]): void => {
	try {
		const serialized = JSON.stringify(lists);
		localStorage.setItem(SAVED_LISTS_KEY, serialized);
	} catch (error) {
		console.error("Failed to save saved lists to localStorage:", error);
	}
};

/**
 * Add a new saved list
 */
export const addSavedList = (list: StorageList): void => {
	try {
		const lists = loadSavedLists();
		lists.push(list);
		saveSavedLists(lists);
	} catch (error) {
		console.error("Failed to add saved list:", error);
	}
};

/**
 * Delete a saved list by ID
 */
export const deleteSavedList = (id: string): void => {
	try {
		const lists = loadSavedLists();
		const filteredLists = lists.filter((l) => l.id !== id);
		saveSavedLists(filteredLists);
	} catch (error) {
		console.error("Failed to delete saved list:", error);
	}
};

/**
 * Get a saved list by ID
 */
export const getSavedList = (id: string): StorageList | null => {
	try {
		const lists = loadSavedLists();
		return lists.find((l) => l.id === id) || null;
	} catch (error) {
		console.error("Failed to get saved list:", error);
		return null;
	}
};
