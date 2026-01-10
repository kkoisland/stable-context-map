import { useEffect, useRef, useState } from "react";
import exportToPDF from "../pdf";
import type { Marker } from "../types";

interface ExportButtonProps {
	markers: Marker[];
}

const ExportButton = ({ markers }: ExportButtonProps) => {
	const [isOpenPanel, setIsOpenPanel] = useState(false);
	const [filename, setFilename] = useState("Untitled.pdf");
	const [includeMap, setIncludeMap] = useState(true);
	const [includeMarkerList, setIncludeMarkerList] = useState(true);
	const panelRef = useRef<HTMLDivElement>(null);
	const justOpenedRef = useRef(false);

	useEffect(() => {
		if (!isOpenPanel) return;

		justOpenedRef.current = true;

		const handleClickOutside = (event: MouseEvent) => {
			if (justOpenedRef.current) {
				justOpenedRef.current = false;
				return;
			}

			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node)
			) {
				setIsOpenPanel(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isOpenPanel]);

	const handleExport = async () => {
		await exportToPDF({ filename, includeMap, includeMarkerList, markers });
		setIsOpenPanel(false);
	};

	return (
		<>
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					setIsOpenPanel(true);
				}}
				title="Export to PDF"
				className="cursor-pointer"
			>
				🖨️
			</button>
			{isOpenPanel && (
				<div
					ref={panelRef}
					className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 dark:text-white p-3 rounded border border-gray-300 dark:border-gray-600"
				>
					<div className="mb-2">
						<div className="mb-1">Filename:</div>
						<input
							type="text"
							value={filename}
							onChange={(e) => setFilename(e.target.value)}
							placeholder="Untitled.pdf"
							className="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
						/>
					</div>
					<div className="mb-2 space-y-1">
						<label className="flex items-center gap-1">
							<input
								type="checkbox"
								checked={includeMap}
								onChange={(e) => setIncludeMap(e.target.checked)}
							/>
							Include Map
						</label>
						<label className="flex items-center gap-1">
							<input
								type="checkbox"
								checked={includeMarkerList}
								onChange={(e) => setIncludeMarkerList(e.target.checked)}
							/>
							Include Marker List
						</label>
					</div>
					<button
						type="button"
						onClick={handleExport}
						className="w-full dark:border-gray-600 py-1"
					>
						Export
					</button>
				</div>
			)}
		</>
	);
};

export default ExportButton;
