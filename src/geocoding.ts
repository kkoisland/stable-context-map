import type { NominatimResult } from "./types";

const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT =
	"stable-context-map/1.0 (https://github.com/kkoisland/stable-context-map)";

const searchLocation = async (
	query: string,
): Promise<NominatimResult | null> => {
	try {
		const url = new URL(NOMINATIM_API_URL);
		url.searchParams.append("q", query);
		url.searchParams.append("format", "json");
		url.searchParams.append("limit", "1");

		const response = await fetch(url.toString(), {
			headers: {
				"User-Agent": USER_AGENT,
			},
		});

		if (!response.ok) {
			throw new Error("Search failed");
		}

		const results: NominatimResult[] = await response.json();

		if (results.length === 0) {
			return null;
		}

		return results[0];
	} catch (error) {
		if (error instanceof Error && error.message === "Search failed") {
			throw error;
		}
		throw new Error("Search failed");
	}
};

export default searchLocation;
