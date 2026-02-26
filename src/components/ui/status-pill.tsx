import type { ReactNode } from "react";

export type StatusVariant =
	| "success"
	| "warning"
	| "error"
	| "info"
	| "neutral";

interface StatusPillProps {
	label: ReactNode;
	variant?: StatusVariant;
	className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
	success: "bg-green-100 text-green-700 border-green-200",
	warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
	error: "bg-red-100 text-red-700 border-red-200",
	info: "bg-blue-100 text-blue-700 border-blue-200",
	neutral: "bg-gray-100 text-gray-600 border-gray-200",
};

export function StatusPill({
	label,
	variant = "neutral",
	className,
}: StatusPillProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${variantStyles[variant]} ${className || ""}`}
		>
			{label}
		</span>
	);
}
