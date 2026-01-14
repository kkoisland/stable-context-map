import { useEffect, useRef, useState } from "react";
import ExportButton from "./components/ExportButton";
import FitBoundsButton from "./components/FitBoundsButton";
import MapView, { type MapViewRef } from "./components/Map";
import MarkerInfo from "./components/MarkerInfo";
import MarkerList from "./components/MarkerList";
import SearchBox from "./components/SearchBox";
import ZoomSelector from "./components/ZoomSelector";
import searchLocation from "./geocoding";
import { exportToJSON, importFromJSON } from "./jsonIO";
import { clearState, loadState, saveState } from "./storage";
import type { Marker } from "./types";

const TOKYO_CENTER: [number, number] = [35.6812, 139.7671];
const DEFAULT_ZOOM = 13;

// Load initial state from localStorage or use defaults
const initialState = loadState();

function App() {
	const mapRef = useRef<MapViewRef>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [zoom, setZoom] = useState(initialState?.zoom ?? DEFAULT_ZOOM);
	const [markers, setMarkers] = useState<Marker[]>(initialState?.markers ?? []);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
	const [center, setCenter] = useState<[number, number]>(
		initialState?.center ?? TOKYO_CENTER,
	);
	const [zoomLocked, setZoomLocked] = useState(false);
	const [isMarkerListOpen, setIsMarkerListOpen] = useState(false);
	const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);

	const selectedIndex = selectedMarkerId
		? markers.findIndex((m) => m.id === selectedMarkerId)
		: null;
	const selectedMarker =
		selectedIndex !== null && selectedIndex >= 0
			? markers[selectedIndex]
			: null;

	// Auto-save to localStorage when state changes
	useEffect(() => {
		saveState({ markers, zoom, center });
	}, [markers, zoom, center]);

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
			pinNumber: pinNumber,
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

			const newMarker = createMarker(
				Number(result.lat),
				Number(result.lon),
				query,
			);
			if (markers.length === 0) {
				setCenter([newMarker.lat, newMarker.lng]);
			}
			setMarkers((prev) => [...prev, newMarker]);
			setSearchValue("");
			setSelectedMarkerId(newMarker.id);
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
		setIsMarkerListOpen(false);
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

	const handleLabelChange = (label: string) => {
		if (selectedMarkerId === null) return;
		setMarkers((prev) =>
			prev.map((m) => (m.id === selectedMarkerId ? { ...m, label } : m)),
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

	const handleMoveToMarker = (id: string) => {
		const marker = markers.find((m) => m.id === id);
		if (!marker) return;
		const bounds = mapRef.current?.getBounds();
		if (bounds?.contains([marker.lat, marker.lng])) return;
		setCenter([marker.lat, marker.lng]);
	};

	const handleMoveToSelectedMarker = () => {
		if (selectedMarkerId) {
			handleMoveToMarker(selectedMarkerId);
		}
	};

	const handleDeleteMarkerFromList = (id: string) => {
		setMarkers((prev) => prev.filter((m) => m.id !== id));
		if (selectedMarkerId === id) {
			setSelectedMarkerId(null);
		}
	};

	const handleMarkerListOpenChange = (isOpen: boolean) => {
		setIsMarkerListOpen(isOpen);
		if (isOpen) {
			setSelectedMarkerId(null);
		}
	};

	const handleClearStorage = () => {
		if (window.confirm("Delete all markers and data?")) {
			clearState();
			setMarkers([]);
			setZoom(DEFAULT_ZOOM);
			setCenter(TOKYO_CENTER);
		}
	};

	const handleFitBounds = () => {
		if (markers.length === 0) return;
		const bounds = markers.map((m) => [m.lat, m.lng] as [number, number]);
		mapRef.current?.fitBounds(bounds);

		const newCenter = mapRef.current?.getCenter();
		const newZoom = mapRef.current?.getZoom();
		if (newCenter) setCenter(newCenter);
		if (newZoom !== undefined) setZoom(newZoom);
	};

	const handleExportJSON = () => {
		const name = markers[0]?.label ?? "marker";
		exportToJSON({
			data: {
				version: "1.0",
				exportedAt: new Date().toISOString(),
				markers,
				zoom,
				center,
			},
			name,
		});
	};

	const handleImportJSON = async (file: File) => {
		try {
			const data = await importFromJSON(file);
			setMarkers(data.markers);
			setZoom(data.zoom);
			setCenter(data.center);
			// Force map to move to imported location
			mapRef.current?.setView(data.center, data.zoom);
		} catch (error) {
			alert("Import failed: invalid JSON file");
			console.error(error);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleImportJSON(file);
			e.target.value = ""; // reset
		}
	};

	return (
		<div className="relative w-full h-full">
			<MapView
				ref={mapRef}
				zoom={zoom}
				onZoomChange={handleZoomChange}
				markers={markers}
				onMarkerClick={handleMarkerClick}
				center={center}
				zoomLocked={zoomLocked}
				onMapClick={handleMapClick}
				markerInfoOpen={
					selectedMarkerId !== null || isMarkerListOpen || isExportPanelOpen
				}
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
			<div className="absolute top-2 right-2 z-[1000] flex gap-2 bg-white/50 dark:bg-gray-800/50 p-2 rounded">
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						handleToggleLock();
					}}
					title={zoomLocked ? "Unlock zoom" : "Lock zoom"}
					className="cursor-pointer text-2xl"
				>
					{zoomLocked ? "🔓" : "🔒"}
				</button>
				<MarkerList
					markers={markers}
					onMarkerClick={handleMarkerClick}
					isOpen={isMarkerListOpen}
					onOpenChange={handleMarkerListOpenChange}
					onMoveToMarker={handleMoveToMarker}
					onDeleteMarker={handleDeleteMarkerFromList}
				/>
				<button
					type="button"
					className="cursor-pointer text-2xl"
					title="Import from JSON"
					onClick={() => fileInputRef.current?.click()}
				>
					📥
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept=".json"
					onChange={handleFileChange}
					style={{ display: "none" }}
				/>
				<button
					type="button"
					className="cursor-pointer text-2xl"
					title="Export to JSON"
					onClick={handleExportJSON}
				>
					📤
				</button>
				<ExportButton
					markers={markers}
					isOpen={isExportPanelOpen}
					onOpenChange={setIsExportPanelOpen}
				/>
				<FitBoundsButton
					onClick={handleFitBounds}
					disabled={markers.length === 0 || zoomLocked}
				/>
				<button
					type="button"
					className="cursor-pointer text-2xl"
					title="Delete all markers and data"
					onClick={handleClearStorage}
				>
					🗑️
				</button>
			</div>
			<MarkerInfo
				marker={selectedMarker}
				markerIndex={selectedIndex}
				onMemoChange={handleMemoChange}
				onLabelChange={handleLabelChange}
				onDelete={handleDeleteMarker}
				onClose={handleClose}
				onMoveToMarker={handleMoveToSelectedMarker}
			/>
		</div>
	);
}

export default App;
