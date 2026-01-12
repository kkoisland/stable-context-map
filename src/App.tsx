import { useEffect, useState } from "react";
import ExportButton from "./components/ExportButton";
import MapView from "./components/Map";
import MarkerInfo from "./components/MarkerInfo";
import MarkerList from "./components/MarkerList";
import SearchBox from "./components/SearchBox";
import StorageListSelector from "./components/StorageListSelector";
import ZoomLockButton from "./components/ZoomLockButton";
import ZoomSelector from "./components/ZoomSelector";
import searchLocation from "./geocoding";
import {
	addSavedList,
	clearCurrentWork,
	deleteSavedList,
	getSavedList,
	loadCurrentWork,
	loadSavedLists,
	saveCurrentWork,
} from "./storage";
import type { Marker } from "./types";

const TOKYO_CENTER: [number, number] = [35.6812, 139.7671];
const DEFAULT_ZOOM = 13;
const CURRENT_WORK_ID = "current";

// Load initial state from localStorage
const loadedCurrentWork = loadCurrentWork();
const initialWork = loadedCurrentWork || {
	id: CURRENT_WORK_ID,
	name: "Current Work",
	createdAt: new Date().toISOString(),
	markers: [],
	zoom: DEFAULT_ZOOM,
	center: TOKYO_CENTER,
};

function App() {
	const [savedLists, setSavedLists] = useState(loadSavedLists());
	const [currentSelection, setCurrentSelection] = useState(CURRENT_WORK_ID);
	const [zoom, setZoom] = useState(initialWork.zoom);
	const [markers, setMarkers] = useState<Marker[]>(initialWork.markers);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
	const [center, setCenter] = useState<[number, number]>(initialWork.center);
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

	// Auto-save current work to localStorage when state changes
	useEffect(() => {
		if (currentSelection === CURRENT_WORK_ID) {
			saveCurrentWork({
				id: CURRENT_WORK_ID,
				name: "Current Work",
				createdAt: initialWork.createdAt,
				markers,
				zoom,
				center,
			});
		}
	}, [markers, zoom, center, currentSelection]);

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
		if (marker) {
			setCenter([marker.lat, marker.lng]);
		}
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

	const handleSelect = (selection: string) => {
		if (selection === CURRENT_WORK_ID) {
			// Load current work
			const currentWork = loadCurrentWork();
			if (currentWork) {
				setMarkers(currentWork.markers);
				setZoom(currentWork.zoom);
				setCenter(currentWork.center);
			}
		} else {
			// Load saved list
			const savedList = getSavedList(selection);
			if (savedList) {
				setMarkers(savedList.markers);
				setZoom(savedList.zoom);
				setCenter(savedList.center);
			}
		}
		setCurrentSelection(selection);
	};

	const handleSave = () => {
		const name = window.prompt("Enter a name for this list:");
		if (name && name.trim()) {
			const newList = {
				id: crypto.randomUUID(),
				name: name.trim(),
				createdAt: new Date().toISOString(),
				markers,
				zoom,
				center,
			};
			addSavedList(newList);
			setSavedLists(loadSavedLists());
			alert(`Saved as "${name}"`);
		}
	};

	const handleClear = () => {
		if (currentSelection === CURRENT_WORK_ID) {
			// Clear current work
			if (window.confirm("Clear all markers and data from current work?")) {
				clearCurrentWork();
				setMarkers([]);
				setZoom(DEFAULT_ZOOM);
				setCenter(TOKYO_CENTER);
			}
		} else {
			// Delete saved list
			if (window.confirm("Delete this saved list?")) {
				deleteSavedList(currentSelection);
				setSavedLists(loadSavedLists());
				// Switch back to current work
				setCurrentSelection(CURRENT_WORK_ID);
				const currentWork = loadCurrentWork();
				if (currentWork) {
					setMarkers(currentWork.markers);
					setZoom(currentWork.zoom);
					setCenter(currentWork.center);
				} else {
					setMarkers([]);
					setZoom(DEFAULT_ZOOM);
					setCenter(TOKYO_CENTER);
				}
			}
		}
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
				markerInfoOpen={
					selectedMarkerId !== null || isMarkerListOpen || isExportPanelOpen
				}
			/>
			<div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-[1000] flex gap-2">
				<SearchBox
					value={searchValue}
					onChange={setSearchValue}
					onSearch={handleSearch}
					loading={loading}
				/>
				<StorageListSelector
					savedLists={savedLists}
					currentSelection={currentSelection}
					onSelect={handleSelect}
					onSave={handleSave}
					onClear={handleClear}
				/>
			</div>
			{!zoomLocked && (
				<div className="absolute bottom-4 left-4 z-[1000]">
					<ZoomSelector zoom={zoom} onZoomChange={handleZoomChange} />
				</div>
			)}
			<div className="absolute top-4 right-4 z-[1000] flex gap-2">
				<ZoomLockButton isLocked={zoomLocked} onToggleLock={handleToggleLock} />
				<ExportButton
					markers={markers}
					isOpen={isExportPanelOpen}
					onOpenChange={setIsExportPanelOpen}
				/>
				<MarkerList
					markers={markers}
					onMarkerClick={handleMarkerClick}
					isOpen={isMarkerListOpen}
					onOpenChange={handleMarkerListOpenChange}
					onMoveToMarker={handleMoveToMarker}
					onDeleteMarker={handleDeleteMarkerFromList}
				/>
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
