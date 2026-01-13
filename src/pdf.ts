import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Marker } from "./types";

interface exportToPDFProps {
	filename: string;
	includeMap: boolean;
	includeMarkerList: boolean;
	markers: Marker[];
}

const createMarkerListElement = (markers: Marker[]): HTMLDivElement => {
	const element = document.createElement("div");
	element.style.cssText =
		"position:absolute;left:-9999px;width:800px;padding:20px;background:#fff;font-family:Arial,sans-serif";

	const title = document.createElement("h2");
	title.textContent = "Marker List";
	title.style.cssText = "font-size:24px;margin-bottom:20px";
	element.appendChild(title);

	markers.forEach((marker, index) => {
		const div = document.createElement("div");
		div.style.cssText = "margin-bottom:20px;font-size:16px;line-height:1.6";

		let html = `<strong>#${index + 1}: ${marker.label}</strong><br>`;
		html += `Coordinates: ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}<br>`;
		if (marker.memo) html += `Memo: ${marker.memo}`;

		div.innerHTML = html;
		element.appendChild(div);
	});

	return element;
};

const exportToPDF = async ({
	filename,
	includeMap,
	includeMarkerList,
	markers,
}: exportToPDFProps) => {
	// Create PDF instance (Letter size)
	const pdf = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "letter",
	});
	const contentWidth = 195; // Content width in mm
	let yPosition = 10; // Current Y position

	if (includeMap) {
		const mapElement = document.querySelector(".leaflet-container");

		if (mapElement) {
			try {
				const canvas = await html2canvas(mapElement as HTMLElement, {
					useCORS: true,
					allowTaint: true,
					backgroundColor: "#ffffff",
				});

				const mapImageData = canvas.toDataURL("image/png");

				// Add map image to PDF (auto-calculate height to maintain aspect ratio)
				const imgHeight = (canvas.height * contentWidth) / canvas.width;

				pdf.addImage(
					mapImageData,
					"PNG",
					10,
					yPosition,
					contentWidth,
					imgHeight,
				);
				yPosition += imgHeight + 10;
			} catch (error) {
				console.error("Failed to capture map:", error);
			}
		} else {
			console.error("Map element not found");
		}
	}

	// Add marker information list to PDF as image
	if (includeMarkerList && markers.length > 0) {
		const element = createMarkerListElement(markers);
		document.body.appendChild(element);

		try {
			const canvas = await html2canvas(element, { backgroundColor: "#fff" });
			const imgHeight = (canvas.height * contentWidth) / canvas.width;
			pdf.addImage(
				canvas.toDataURL("image/png"),
				"PNG",
				10,
				yPosition,
				contentWidth,
				imgHeight,
			);
		} catch (error) {
			console.error("Failed to capture marker list:", error);
		} finally {
			document.body.removeChild(element);
		}
	}

	// Download PDF using Blob to support Japanese filenames
	const pdfBlob = pdf.output("blob");
	const link = document.createElement("a");
	link.href = URL.createObjectURL(pdfBlob);
	// Ensure .pdf extension
	const downloadFilename = filename.endsWith(".pdf")
		? filename
		: `${filename}.pdf`;
	link.download = downloadFilename;
	link.click();
	URL.revokeObjectURL(link.href);
};

export default exportToPDF;
