import { queryInstancesCache } from '$lib/instances';

export async function load() {
	const instances = await queryInstancesCache();
	return {
		instances: Math.random() < 0.5 ? instances : []
	};
}
