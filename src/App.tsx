import { useState } from "react";
import MapView from "./components/Map";
import SearchBox from "./components/SearchBox";

function App() {
	const [zoom, setZoom] = useState(13);
	const handleZoomChange = (newZoom: number) => {
		setZoom(newZoom);
	};

	return (
		<div style={{ position: "relative", width: "100%", height: "100%" }}>
			<MapView zoom={zoom} onZoomChange={handleZoomChange} />
			<SearchBox />
		</div>
	);
}

export default App;
