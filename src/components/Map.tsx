import { useEffect } from "react";
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
	center: [number, number];
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

const MapView = ({
	zoom,
	onZoomChange,
	markers,
	onMarkerClick,
	center,
}: MapViewProps) => {
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
			<CenterHandler center={center} />
			{markers.map((marker) => (
				<Marker
					key={marker.id}
					position={[marker.lat, marker.lng]}
					eventHandlers={{ click: () => onMarkerClick(marker.id) }}
				/>
			))}
		</MapContainer>
	);
};

export default MapView;
