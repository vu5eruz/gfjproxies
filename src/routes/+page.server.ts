import { queryInstancesDataCache } from '$lib/instances';

export async function load({ platform }) {
	const storage = platform?.env?.STORAGE;
	if (!storage) return { instances: [], timestamp: undefined };

	const cache = await queryInstancesDataCache(storage);
	const instances = Object.values(cache?.queries ?? {}).sort((a, b) => {
		// 1. Sort on status: 2xx < 4xx < 5xx < (error) -1
		const sA = a.status === -1 ? Infinity : a.status;
		const sB = b.status === -1 ? Infinity : b.status;
		if (sA !== sB) return sA - sB;

		// 2. If same status and not erroring
		if (a.status !== -1) {
			const aData = a.data;
			const bData = b.data;

			// 3. Sort on data presence: data < no-data
			if (!aData !== !bData) return aData ? -1 : 1;

			if (aData && bData) {
				// 4. Sort on bandwidth: less usage < more usage < (no tracking) -1
				const bA = aData.bandwidth === -1 ? Infinity : aData.bandwidth;
				const bB = bData.bandwidth === -1 ? Infinity : bData.bandwidth;
				if (bA !== bB) return bA - bB;
			}
		}

		// 5. Fallback: URL alphabetical sort
		return a.url.localeCompare(b.url, 'en-US');
	});

	return {
		instances: instances,
		timestamp: cache?.timestamp
	};
}
