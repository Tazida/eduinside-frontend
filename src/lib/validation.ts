export function isEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Shared input styling for the light forms, with a red border when the field has an error. */
export function inputClass(invalid: boolean): string {
	return `w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
		invalid ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
	}`;
}
