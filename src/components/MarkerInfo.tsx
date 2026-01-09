import { useEffect, useRef } from "react";
import type { Marker } from "../types";

interface MarkerInfoProps {
	marker: Marker | null;
	markerIndex: number | null;
	onMemoChange: (memo: string) => void;
	onLabelChange: (label: string) => void;
	onDelete: () => void;
	onClose: () => void;
}

const MarkerInfo = ({
	marker,
	markerIndex,
	onMemoChange,
	onLabelChange,
	onDelete,
	onClose,
}: MarkerInfoProps) => {
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		const timer = setTimeout(() => {
			document.addEventListener("click", handleClickOutside);
		}, 0);

		return () => {
			clearTimeout(timer);
			document.removeEventListener("click", handleClickOutside);
		};
	}, [onClose]);

	if (marker === null || markerIndex === null) return null;

	return (
		<div
			ref={panelRef}
			className="absolute bottom-2 right-2 w-80 p-4 rounded-lg bg-white/70 dark:bg-gray-800/70 dark:text-white z-[1000]"
			style={{
				boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
			}}
		>
			<div className="flex justify-between items-center mb-2">
				<h3 className="font-bold">Marker #{markerIndex + 1}</h3>
				<div className="flex items-center gap-2">
					<button type="button" onClick={onDelete} title="Delete Marker">
						🗑️
					</button>
					<button
						type="button"
						onClick={onClose}
						className="text-xl leading-none hover:opacity-70"
						title="Close"
					>
						×
					</button>
				</div>
			</div>
			<div className="space-y-2 text-sm">
				<div className="flex items-center gap-2">
					<strong>Name:</strong>
					<textarea
						value={marker.label}
						onChange={(e) => onLabelChange(e.target.value)}
						className="w-full p-1 rounded resize-none bg-white dark:bg-gray-700 dark:border-gray-600"
						rows={1}
						style={{
							border: "1px solid #ddd",
						}}
					/>
				</div>
				<div>
					<strong>Coordinates:</strong> {marker.lat.toFixed(4)},{" "}
					{marker.lng.toFixed(4)}
				</div>
				<div>
					<strong>Memo:</strong>
					<textarea
						value={marker.memo || ""}
						onChange={(e) => onMemoChange(e.target.value)}
						placeholder="Add a note..."
						className="w-full mt-1 p-2 rounded resize-none bg-white dark:bg-gray-700 dark:border-gray-600"
						rows={3}
						style={{
							border: "1px solid #ddd",
						}}
					/>
				</div>
			</div>
			<div className="mt-4 flex justify-end"></div>
		</div>
	);
};

export default MarkerInfo;
