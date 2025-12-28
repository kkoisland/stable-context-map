import { useState } from "react";
import MapView from "./components/Map";

function App() {
	const [zoom, setZoom] = useState(13);

	const handleZoomChange = (newZoom: number) => {
		// setZoom(newZoom);
	};

	return <MapView zoom={zoom} onZoomChange={handleZoomChange} />;
}

export default App;
