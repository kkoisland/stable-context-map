import type { ExportData } from "./types";
interface exportToJSONProps {
	data: ExportData;
	name: string;
}

export const exportToJSON = ({ data, name }: exportToJSONProps): void => {
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${name}-${Date.now()}.json`;
	a.click();
	URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<ExportData> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string);
				// Validate required fields
				if (!data.version || !Array.isArray(data.markers)) {
					throw new Error("Invalid format");
				}
				resolve(data);
			} catch (error) {
				reject(error);
			}
		};
		reader.onerror = () => reject(new Error("File read failed"));
		reader.readAsText(file);
	});
};
