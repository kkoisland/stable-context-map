const SearchBox = () => (
	<div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-[1000]">
		<form onSubmit={(e) => e.preventDefault()}>
			<input
				type="text"
				placeholder="Search location..."
				className="pointer-events-auto w-[300px] px-4 py-3 rounded-lg outline-none"
				style={{
					backgroundColor: "white",
					border: "1px solid #ddd",
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
				}}
			/>
		</form>
	</div>
);

export default SearchBox;
