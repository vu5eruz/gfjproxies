import { queryInstancesDataCache } from '$lib/instances';

export async function load({ platform }) {
	const cache = await queryInstancesDataCache(platform!.env.STORAGE);
	return {
		instances: Object.values(cache?.queries ?? {}),
		timestamp: cache?.timestamp
	};
}
