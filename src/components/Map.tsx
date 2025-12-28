import { MapContainer, TileLayer } from "react-leaflet";

interface MapViewProps {
	zoom: number;
	onZoomChange: (zoom: number) => void;
}

const TOKYO_CENTER: [number, number] = [35.6812, 139.7671];

function MapView({ zoom, onZoomChange }: MapViewProps) {
	return (
		<MapContainer
			center={TOKYO_CENTER}
			zoom={zoom}
			style={{ width: "100%", height: "100%" }}
			zoomControl={true}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
		</MapContainer>
	);
}

export default MapView;
