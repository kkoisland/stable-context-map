import { useState } from "react";
import ExportButton from "./components/ExportButton";
import MapView from "./components/Map";
import MarkerInfo from "./components/MarkerInfo";
import SearchBox from "./components/SearchBox";
import ZoomLockButton from "./components/ZoomLockButton";
import ZoomSelector from "./components/ZoomSelector";
import searchLocation from "./geocoding";
import type { Marker } from "./types";

const TOKYO_CENTER: [number, number] = [35.6812, 139.7671];

function App() {
	const [zoom, setZoom] = useState(13);
	const [markers, setMarkers] = useState<Marker[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
	const [center, setCenter] = useState<[number, number]>(TOKYO_CENTER);
	const [zoomLocked, setZoomLocked] = useState(false);

	const selectedIndex = selectedMarkerId
		? markers.findIndex((m) => m.id === selectedMarkerId)
		: null;
	const selectedMarker =
		selectedIndex !== null && selectedIndex >= 0
			? markers[selectedIndex]
			: null;

	const handleZoomChange = (newZoom: number) => {
		setZoom(newZoom);
	};

	const createMarker = (lat: number, lng: number, label?: string): Marker => {
		const pinNumber = markers.length + 1;
		return {
			id: crypto.randomUUID(),
			lat,
			lng,
			label: label || `Pin ${pinNumber}`,
		};
	};

	const handleSearch = async (query: string) => {
		setLoading(true);
		try {
			const result = await searchLocation(query);

			if (!result) {
				alert("Location not found");
				return;
			}

			const newMarker = createMarker(Number(result.lat), Number(result.lon), query);
			if (markers.length === 0) {
				setCenter([newMarker.lat, newMarker.lng]);
			}
			setMarkers((prev) => [...prev, newMarker]);
			setSearchValue("");
		} catch (error) {
			if (error instanceof Error && error.message === "Search failed")
				throw error;
			alert("Search failed");
		} finally {
			setLoading(false);
		}
	};

	const handleMarkerClick = (id: string) => {
		setSelectedMarkerId(id);
	};

	const handleClose = () => {
		setSelectedMarkerId(null);
	};

	const handleDeleteMarker = () => {
		setMarkers((prev) => prev.filter((m) => m.id !== selectedMarkerId));
		setSelectedMarkerId(null);
	};

	const handleMemoChange = (memo: string) => {
		if (selectedMarkerId === null) return;

		setMarkers((prev) =>
			prev.map((m) => (m.id === selectedMarkerId ? { ...m, memo } : m)),
		);
	};

	const handleToggleLock = () => {
		setZoomLocked(!zoomLocked);
	};

	const handleMapClick = (lat: number, lng: number) => {
		const newMarker = createMarker(lat, lng);
		setMarkers((prev) => [...prev, newMarker]);
		setSelectedMarkerId(newMarker.id);
	};

	return (
		<div className="relative w-full h-full">
			<MapView
				zoom={zoom}
				onZoomChange={handleZoomChange}
				markers={markers}
				onMarkerClick={handleMarkerClick}
				center={center}
				zoomLocked={zoomLocked}
				onMapClick={handleMapClick}
			/>
			<SearchBox
				value={searchValue}
				onChange={setSearchValue}
				onSearch={handleSearch}
				loading={loading}
			/>
			{!zoomLocked && (
				<div className="absolute bottom-4 left-4 z-[1000]">
					<ZoomSelector zoom={zoom} onZoomChange={handleZoomChange} />
				</div>
			)}
			<div className="absolute top-4 right-4 z-[1000] flex gap-2">
				<ZoomLockButton isLocked={zoomLocked} onToggleLock={handleToggleLock} />
				<ExportButton markers={markers} />
			</div>
			<MarkerInfo
				marker={selectedMarker}
				markerIndex={selectedIndex}
				onMemoChange={handleMemoChange}
				onDelete={handleDeleteMarker}
				onClose={handleClose}
			/>
		</div>
	);
}

export default App;
