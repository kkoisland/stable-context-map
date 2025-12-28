const SearchBox = () => (
	<div
		style={{
			position: "absolute",
			top: "16px",
			left: "50%",
			transform: "translateX(-50%)",
			pointerEvents: "none",
			zIndex: 1000,
		}}
	>
		<form onSubmit={(e) => e.preventDefault()}>
			<input
				type="text"
				placeholder="Search location..."
				style={{
					pointerEvents: "auto",
					width: "300px",
					padding: "12px 16px",
					border: "1px solid #ddd",
					borderRadius: "8px",
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
					outline: "none",
				}}
			/>
		</form>
	</div>
);

export default SearchBox;
