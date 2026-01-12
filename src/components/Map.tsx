import type { LatLngBounds } from "leaflet";
import L from "leaflet";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
	MapContainer,
	Marker,
	TileLayer,
	useMap,
	useMapEvents,
} from "react-leaflet";
import type { Marker as MarkerType } from "../types";

interface MapViewProps {
	zoom: number;
	onZoomChange: (zoom: number) => void;
	markers: MarkerType[];
	onMarkerClick: (id: string) => void;
	onMapClick: (lat: number, lng: number) => void;
	center: [number, number];
	zoomLocked: boolean;
	markerInfoOpen: boolean;
}

const TOKYO_CENTER: [number, number] = [35.6812, 139.7671];

const ZoomHandler = ({
	onZoomChange,
}: {
	onZoomChange: (zoom: number) => void;
}) => {
	useMapEvents({
		zoomend: (e) => {
			const newZoom = e.target.getZoom();
			onZoomChange(newZoom);
		},
	});
	return null;
};

const CenterHandler = ({ center }: { center: [number, number] }) => {
	const map = useMap();

	useEffect(() => {
		map.setView(center, map.getZoom());
	}, [center, map]);

	return null;
};

const ZoomUpdateHandler = ({ zoom }: { zoom: number }) => {
	const map = useMap();

	useEffect(() => {
		const currentZoom = map.getZoom();
		if (currentZoom !== zoom) {
			map.setZoom(zoom);
		}
	}, [zoom, map]);

	return null;
};

const ZoomLockHandler = ({ zoomLocked }: { zoomLocked: boolean }) => {
	const map = useMap();

	useEffect(() => {
		if (zoomLocked) {
			map.scrollWheelZoom.disable();
			map.doubleClickZoom.disable();
			map.touchZoom.disable();
			map.boxZoom.disable();
			if (map.zoomControl) {
				map.removeControl(map.zoomControl);
				// biome-ignore lint: false positive
				(map as any).zoomControl = undefined;
			}
		} else {
			map.scrollWheelZoom.enable();
			map.doubleClickZoom.enable();
			map.touchZoom.enable();
			map.boxZoom.enable();
			if (!map.zoomControl) {
				map.zoomControl = L.control.zoom();
				map.addControl(map.zoomControl);
			}
		}
	}, [zoomLocked, map]);

	return null;
};

const MapClickHandler = ({
	onMapClick,
	disabled,
}: {
	onMapClick: (lat: number, lng: number) => void;
	disabled: boolean;
}) => {
	useMapEvents({
		click: (e) => {
			if (disabled) return;
			const { lat, lng } = e.latlng;
			onMapClick(lat, lng);
		},
	});
	return null;
};

export interface MapViewRef {
	getBounds: () => LatLngBounds | null;
	fitBounds: (bounds: [number, number][]) => void;
}

const MapRefHandler = forwardRef<MapViewRef, object>((_, ref) => {
	const map = useMap();

	useImperativeHandle(ref, () => ({
		getBounds: () => map.getBounds(),
		fitBounds: (bounds) => map.fitBounds(bounds),
	}));

	return null;
});

const MapView = forwardRef<MapViewRef, MapViewProps>(
	(
		{
			zoom,
			onZoomChange,
			markers,
			onMarkerClick,
			onMapClick,
			center,
			zoomLocked,
			markerInfoOpen,
		},
		ref,
	) => {
		return (
			<MapContainer
				center={TOKYO_CENTER}
				zoom={zoom}
				className="w-full h-full"
				zoomControl={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<ZoomHandler onZoomChange={onZoomChange} />
				<ZoomUpdateHandler zoom={zoom} />
				<CenterHandler center={center} />
				<ZoomLockHandler zoomLocked={zoomLocked} />
				<MapClickHandler onMapClick={onMapClick} disabled={markerInfoOpen} />
				<MapRefHandler ref={ref} />
				{markers.map((marker, index) => {
					const icon = L.divIcon({
						html: `<div style="
						position: relative;
						width: 30px;
						height: 30px;
					">
						<div style="
							background: #3b82f6;
							width: 30px;
							height: 30px;
							border-radius: 50% 50% 50% 0;
							transform: rotate(-45deg);
						"></div>
						<div style="
						  position: absolute;
							inset: 0;
							display: flex;
							align-items: center;
							justify-content: center;
							color: white;
							font-weight: bold;
							font-size: 14px;
						">${index + 1}</div>
					</div>`,
						className: "",
						iconSize: [40, 40],
						iconAnchor: [20, 30],
					});
					return (
						<Marker
							key={marker.id}
							position={[marker.lat, marker.lng]}
							icon={icon}
							eventHandlers={{ click: () => onMarkerClick(marker.id) }}
						/>
					);
				})}
			</MapContainer>
		);
	},
);

export default MapView;
