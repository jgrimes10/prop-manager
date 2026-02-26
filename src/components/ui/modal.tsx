import React from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	size: ModalSize;
	children: React.ReactNode;
}

export function Modal({
	isOpen,
	onClose,
	title,
	description,
	size = "md",
	children,
}: ModalProps) {
	const overlayRef = React.useRef<HTMLDivElement | null>(null);

	// Close on ESC
	React.useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	// Prevent body scroll while open
	React.useEffect(() => {
		if (!isOpen) return;

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const sizeClass =
		size === "sm" ? "max-w-md" : size === "lg" ? "max-w-2xl" : "max-w-lg";

	return createPortal(
		<div
			ref={overlayRef}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
			aria-modal="true"
			role="dialog"
			onMouseDown={(e) => {
				if (e.target === overlayRef.current) {
					onClose();
				}
			}}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: this is a specialized case to dismiss the modal when the backdrop is clicked */}
			<div
				className={`relative w-full ${sizeClass} rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150`}
				onMouseDown={(e) => e.stopPropagation()}
			>
				<header className="mb-4 flex items-start justify-between gap-4">
					<div>
						<h2 className="text-base font-semibold text-gray-900">{title}</h2>
						{description ? (
							<p className="mt-1 text-xs text-gray-500">{description}</p>
						) : null}
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close modal"
						className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition
            hover:bg-gray-100 hover:text-gray-800
            focus:outline-transparent focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						✕
					</button>
				</header>

				<div>{children}</div>
			</div>
		</div>,
		document.body,
	);
}
