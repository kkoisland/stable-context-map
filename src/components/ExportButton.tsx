const ExportButton = () => {
	const handleExport = () => {
		console.log("Export button clicked");
	};

	return (
		<div className="absolute top-4 right-4 z-[1000]">
			<button
				type="button"
				onClick={handleExport}
				title="Export to PDF"
				className="cursor-pointer"
			>
				🖨️
			</button>
		</div>
	);
};

export default ExportButton;
