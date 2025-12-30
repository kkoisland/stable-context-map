import { useState } from "react";
import MapView from "./components/Map";
import SearchBox from "./components/SearchBox";
import searchLocation from "./geocoding";
import type { Marker } from "./types";

function App() {
	const [zoom, setZoom] = useState(13);
	const [markers, setMarkers] = useState<Marker[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const handleZoomChange = (newZoom: number) => {
		setZoom(newZoom);
	};

	const handleSearch = async (query: string) => {
		setLoading(true);
		try {
			const result = await searchLocation(query);

			if (!result) {
				alert("Location not found");
				return;
			}

			const newMarker: Marker = {
				id: crypto.randomUUID(),
				lat: Number(result.lat),
				lng: Number(result.lon),
				label: query,
				address: result.display_name,
			};
			setMarkers((prev) => [...prev, newMarker]);
			console.log("Added marker:", newMarker);
			console.log("markers", markers);
			setSearchValue("");
		} catch (error) {
			if (error instanceof Error && error.message === "Search failed")
				throw error;
			alert("Search failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative w-full h-full">
			<MapView zoom={zoom} onZoomChange={handleZoomChange} markers={markers} />
			<SearchBox
				value={searchValue}
				onChange={setSearchValue}
				onSearch={handleSearch}
				loading={loading}
			/>
		</div>
	);
}

export default App;
