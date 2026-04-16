import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Format currency in EUR (ES locale) */
export function formatCurrency(
	value: number | string | null | undefined,
): string {
	const num = Number(value ?? 0);
	return num.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

/** Format a date to DD/MM/YYYY */
export function formatDate(value: string | null | undefined): string {
	if (!value) return "-";
	return new Date(value).toLocaleDateString("es-ES");
}

/** Format a date+time to DD/MM/YYYY HH:mm */
export function formatDateTime(value: string | null | undefined): string {
	if (!value) return "-";
	return new Date(value).toLocaleString("es-ES", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}
