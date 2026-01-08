interface ZoomSelectorProps {
	zoom: number;
	onZoomChange: (zoom: number) => void;
}

const ZoomSelector = ({ zoom, onZoomChange }: ZoomSelectorProps) => {
	return (
		<select
			value={zoom}
			onChange={(e) => onZoomChange(Number(e.target.value))}
			className="px-2 py-1 bg-white/70 dark:bg-gray-800/70 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
		>
			<option value={5}>Zoom 5 (Wide - Multiple Countries)</option>
			<option value={8}>Zoom 8 (Region)</option>
			<option value={10}>Zoom 10 (Large Area)</option>
			<option value={13}>Zoom 13 (City)</option>
			<option value={16}>Zoom 16 (Detailed)</option>
			<option value={18}>Zoom 18 (Very Detailed)</option>
		</select>
	);
};

export default ZoomSelector;
