import { useEffect, type RefObject } from "react";

/**
 * Custom hook to detect clicks outside of a referenced element
 * @param ref - React ref object pointing to the element
 * @param handler - Callback function to execute when click outside is detected
 * @param isActive - Whether the detection is active (default: true)
 */
export const useClickOutside = (
	ref: RefObject<HTMLElement | null>,
	handler: () => void,
	isActive = true,
) => {
	useEffect(() => {
		if (!isActive) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler();
			}
		};

		// Delay adding listener to avoid immediate trigger
		const timer = setTimeout(() => {
			document.addEventListener("click", handleClickOutside);
		}, 0);

		return () => {
			clearTimeout(timer);
			document.removeEventListener("click", handleClickOutside);
		};
	}, [ref, handler, isActive]);
};
