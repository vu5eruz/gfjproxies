export function formatMebibytes(value: number) {
	return value < 1000 ? `${value} MiB` : `${(value / 1024).toFixed(0)} GiB`;
}

export function formatDuration(value: number, settings?: { expanded?: boolean }) {
	settings = settings ?? {};

	if (settings.expanded) {
		const seconds = value % 60;
		const minutes = Math.floor((value /= 60)) % 60;
		const hours = Math.floor((value /= 60)) % 24;
		const days = (value /= 24);

		const values = [
			days ? `${days.toFixed()}d` : '',
			hours ? `${hours}h` : '',
			minutes ? `${minutes}min` : '',
			seconds ? `${seconds}s` : ''
		];

		return values.filter(Boolean).join(' ');
	}

	return `${value.toLocaleString('en')}s`;
}

export function formatRelativeTime(timestamp: string) {
	const date = new Date(timestamp);
	const now = new Date();
	const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);

	const units = [
		{ unit: 'year', seconds: 31536000 },
		{ unit: 'month', seconds: 2592000 },
		{ unit: 'week', seconds: 604800 },
		{ unit: 'day', seconds: 86400 },
		{ unit: 'hour', seconds: 3600 },
		{ unit: 'minute', seconds: 60 },
		{ unit: 'second', seconds: 1 }
	] as {
		unit: Intl.RelativeTimeFormatUnit;
		seconds: number;
	}[];

	for (const { unit, seconds } of units) {
		if (Math.abs(diffInSeconds) >= seconds || unit === 'second') {
			const value = Math.round(diffInSeconds / seconds);
			const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
			return rtf.format(value, unit);
		}
	}

	// unreachable
	return '?';
}
