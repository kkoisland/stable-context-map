import { useEffect, useRef, type FormEvent } from "react";

interface SearchBoxProps {
	value: string;
	onChange: (value: string) => void;
	onSearch: (query: string) => void;
	loading: boolean;
}

const SearchBox = ({ value, onChange, onSearch, loading }: SearchBoxProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!loading) inputRef.current?.focus();
	}, [loading]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const trimmed = value.trim();
		if (!trimmed) return;
		onSearch(trimmed);
	};

	return (
		<div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-[1000]">
			<form onSubmit={handleSubmit}>
				<input
					ref={inputRef}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={loading}
					type="text"
					placeholder="Search location..."
					className="pointer-events-auto w-[300px] px-4 py-3 rounded-lg outline-none bg-white dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
					style={{
						border: "1px solid #ddd",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
					}}
				/>
			</form>
		</div>
	);
};

export default SearchBox;
