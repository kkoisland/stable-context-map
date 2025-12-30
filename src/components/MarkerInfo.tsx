import { useEffect, useRef } from "react";
import type { Marker } from "../types";

interface MarkerInfoProps {
	marker: Marker | null;
	markerIndex: number | null;
	onMemoChange: (memo: string) => void;
	onDelete: () => void;
	onClose: () => void;
}

const MarkerInfo = ({
	marker,
	markerIndex,
	onMemoChange,
	onDelete,
	onClose,
}: MarkerInfoProps) => {
	const panelRef = useRef<HTMLDivElement>(null);
	const justOpenedRef = useRef(false);

	useEffect(() => {
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
				onClose();
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [onClose]);

	if (marker === null || markerIndex === null) return null;

	return (
		<div
			ref={panelRef}
			className="absolute bottom-4 right-4 w-80 p-4 rounded-lg bg-white dark:bg-gray-800 dark:text-white z-[1000]"
			style={{
				boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
			}}
		>
			<div className="flex justify-between items-center mb-2">
				<h3 className="font-bold">Marker #{markerIndex + 1}</h3>
				<button
					type="button"
					onClick={onClose}
					className="text-xl leading-none hover:opacity-70"
				>
					×
				</button>
			</div>
			<div className="space-y-2 text-sm">
				<div>
					<strong>Name:</strong> {marker.label}
				</div>
				<div>
					<strong>Coordinates:</strong> {marker.lat.toFixed(4)},{" "}
					{marker.lng.toFixed(4)}
				</div>
				{marker.address && (
					<div>
						<strong>Address:</strong> {marker.address}
					</div>
				)}
				<div>
					<strong>Memo:</strong>
					<textarea
						value={marker.memo || ""}
						readOnly
						placeholder="Add a note..."
						className="w-full mt-1 p-2 border rounded resize-none bg-white dark:bg-gray-700 dark:border-gray-600"
						rows={3}
						style={{
							border: "1px solid #ddd",
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default MarkerInfo;
