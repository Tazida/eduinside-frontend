/** Parses an API date ("YYYY-MM-DD") as a local calendar day, not UTC midnight. */
function parseDay(value: string): Date {
	return new Date(`${value.slice(0, 10)}T00:00:00`);
}

/** "2026-11-15" → "Sun, 15 Nov 2026" */
export function formatDate(value?: string | null): string {
	if (!value) return '';
	return parseDay(value).toLocaleDateString('en-GB', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

/** Whole days from today until the given date (negative once it has passed). */
export function daysUntil(value?: string | null): number | null {
	if (!value) return null;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return Math.round((parseDay(value).getTime() - today.getTime()) / 86_400_000);
}
