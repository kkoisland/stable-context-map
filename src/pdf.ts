import type { Marker } from "./types";

interface exportToPDFProps {
	filename: string;
	includeMap: boolean;
	includeMarkerList: boolean;
	markers: Marker[];
}

const exportToPDF = ({
	filename,
	includeMap,
	includeMarkerList,
	markers,
}: exportToPDFProps) => {
	console.log("exportToPDF called", {
		filename,
		includeMap,
		includeMarkerList,
		markers,
	});
	// TODO: Implement PDF generation
};

export default exportToPDF;
