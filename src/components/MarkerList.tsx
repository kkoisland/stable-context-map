import { useEffect, useRef } from "react";
import type { Marker } from "../types";

interface MarkerListProps {
	markers: Marker[];
	onMarkerClick: (id: string) => void;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

const MarkerList = ({
	markers,
	onMarkerClick,
	isOpen,
	onOpenChange,
}: MarkerListProps) => {
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node)
			) {
				onOpenChange(false);
			}
		};

		const timer = setTimeout(() => {
			document.addEventListener("click", handleClickOutside);
		}, 0);

		return () => {
			clearTimeout(timer);
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isOpen, onOpenChange]);

	return (
		<>
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onOpenChange(true);
				}}
				title="Open Marker List"
				className="cursor-pointer"
			>
				📋
			</button>
			{isOpen && (
				<div
					ref={panelRef}
					className="absolute top-12 right-0 w-64 max-h-96 overflow-y-auto bg-white/70 dark:bg-gray-800/70 dark:text-white p-3 rounded border border-gray-300 dark:border-gray-600"
				>
					<div className="mb-2 font-bold">Markers</div>
					{markers.length === 0 ? (
						<div className="text-sm text-gray-500">No markers</div>
					) : (
						<div className="space-y-1">
							{markers.map((marker, index) => (
								// biome-ignore lint: false positive
								<div
									key={marker.id}
									onClick={() => {
										onMarkerClick(marker.id);
										onOpenChange(false);
									}}
									className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer text-sm"
								>
									<span className="font-bold">{index + 1}.</span> {marker.label}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default MarkerList;
