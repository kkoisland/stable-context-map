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
			<optgroup label="Global">
				<option value={2}>Zoom 2 (World)</option>
				<option value={3}>Zoom 3 (Continent)</option>
				<option value={4}>Zoom 4 (Multiple Countries)</option>
				<option value={5}>Zoom 5 (Country)</option>
				<option value={6}>Zoom 6 (Wide Region)</option>
			</optgroup>

			<optgroup label="Regional / City">
				<option value={8}>Zoom 8 (Region)</option>
				<option value={9}>Zoom 9 (Metro Area)</option>
				<option value={10}>Zoom 10 (Large Area)</option>
				<option value={11}>Zoom 11 (City Area)</option>
				<option value={12}>Zoom 12 (City Overview)</option>
				<option value={13}>Zoom 13 (City)</option>
				<option value={14}>Zoom 14 (City Detail)</option>
			</optgroup>

			<optgroup label="Detail">
				<option value={15}>Zoom 15 (Neighborhood)</option>
				<option value={16}>Zoom 16 (Detailed)</option>
				<option value={17}>Zoom 17 (Street)</option>
				<option value={18}>Zoom 18 (Building)</option>
			</optgroup>
		</select>
	);
};

export default ZoomSelector;
