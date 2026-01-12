import type { StorageList } from "../types";

const CURRENT_WORK_VALUE = "current";

interface StorageListSelectorProps {
	savedLists: StorageList[];
	currentSelection: string; // "current" or saved list ID
	onSelect: (selection: string) => void;
	onSave: () => void;
	onClear: () => void;
}

const StorageListSelector = ({
	savedLists,
	currentSelection,
	onSelect,
	onSave,
	onClear,
}: StorageListSelectorProps) => {
	const isCurrentWork = currentSelection === CURRENT_WORK_VALUE;

	return (
		<div className="flex gap-2 pointer-events-auto">
			<select
				value={currentSelection}
				onChange={(e) => onSelect(e.target.value)}
				className="px-2 py-1 bg-white/70 dark:bg-gray-800/70 dark:text-white rounded cursor-pointer focus:outline-none"
			>
				<option value={CURRENT_WORK_VALUE}>Current Work</option>
				{savedLists.map((list) => (
					<option key={list.id} value={list.id}>
						{list.name}
					</option>
				))}
			</select>
			{isCurrentWork && (
				<button
					type="button"
					onClick={onSave}
					className="px-2 py-1 bg-white/70 dark:bg-gray-800/70 dark:text-white rounded cursor-pointer"
					title="Save current work"
				>
					💾
				</button>
			)}
			<button
				type="button"
				onClick={onClear}
				className="px-2 py-1 bg-white/70 dark:bg-gray-800/70 dark:text-white rounded cursor-pointer"
				title={isCurrentWork ? "Clear current work" : "Delete this list"}
			>
				🗑️
			</button>
		</div>
	);
};

export default StorageListSelector;
