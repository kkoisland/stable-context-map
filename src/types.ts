/**
 * Marker information
 */
export interface Marker {
	id: string;
	lat: number;
	lng: number;
	label: string;
	memo?: string;
}

/**
 * Application state (managed in App.tsx)
 */
export interface AppState {
	zoom: number;
	markers: Marker[];
}

/**
 * PDF export options
 */
export interface ExportOptions {
	includeMap: boolean;
	includeMarkerList: boolean;
}

/**
 * Nominatim API response (essential fields only)
 */
export interface NominatimResult {
	lat: string;
	lon: string;
	display_name: string;
	name?: string;
}
