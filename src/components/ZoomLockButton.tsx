interface ZoomLockButtonProps {
	isLocked: boolean;
	onToggleLock: () => void;
}

const ZoomLockButton = ({ isLocked, onToggleLock }: ZoomLockButtonProps) => {
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				onToggleLock();
			}}
			title={isLocked ? "Unlock zoom" : "Lock zoom"}
			className="cursor-pointer"
		>
			{isLocked ? "🔓" : "🔒"}
		</button>
	);
};

export default ZoomLockButton;
