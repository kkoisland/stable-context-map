interface FitBoundsButtonProps {
	onClick: () => void;
	disabled: boolean;
}

const FitBoundsButton = ({ onClick, disabled }: FitBoundsButtonProps) => {
	return (
		<button
			type="button"
			title="Show all markers"
			onClick={onClick}
			disabled={disabled}
			className={`text-2xl ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
		>
			🌍
		</button>
	);
};

export default FitBoundsButton;
