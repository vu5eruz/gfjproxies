const INSTANCES = [
	'https://geminiforjanitors-wq7l.onrender.com',
	'https://geminiforjanitors-rhuc.onrender.com',
	'https://geminiforjanitors-r7wu.onrender.com',
	'https://geminiforjanitors-s34l.onrender.com',
	'https://geminiforjanitors-g24s.onrender.com',
	'https://geminiforjanitors-k4v3.onrender.com'
] as const;

const CACHE_KEY = 'instancesData';

export interface InstanceData {
	admin: string;
	bandwidth: number;
	bwarning: number;
	cooldown: number;
	cpolicy: string;
	keyspace: number;
	uptime: number;
	version: string;
}

export interface InstanceDataQuery {
	url: string;
	status: number;
	statusText: string;
	timestamp: string;
	timingMs: number;
	error: string;
	data?: InstanceData;
}

interface InstanceDataCache {
	queries: Record<string, InstanceDataQuery>;
	timestamp: string;
}

async function queryInstance(url: string): Promise<InstanceDataQuery> {
	const timestamp = new Date().toISOString();
	const startTime = performance.now();

	try {
		const response = await fetch(`${url}/health`, {
			signal: AbortSignal.timeout(2500)
		});

		const data = response.ok ? await response.json() : {};

		return {
			url,
			status: response.status,
			statusText: response.statusText,
			timestamp: timestamp,
			timingMs: Math.round(performance.now() - startTime),
			data: data as InstanceData,
			error: 'NoError'
		};
	} catch (error) {
		return {
			url,
			status: -1,
			statusText: '',
			timestamp: timestamp,
			timingMs: 0,
			error: error instanceof Error ? error.name : 'UnknownError'
		};
	}
}

export async function queryInstancesDataCache(kv: KVNamespace<string>) {
	return (await kv.get(CACHE_KEY, 'json')) as InstanceDataCache | null;
}

export async function refreshInstancesDataCache(kv: KVNamespace<string>) {
	const results = await Promise.all(INSTANCES.map(queryInstance));
	const cache = await kv.get<InstanceDataCache>(CACHE_KEY, 'json');

	const oldQueries: Record<string, InstanceDataQuery> = cache?.queries || {};
	const newQueries: Record<string, InstanceDataQuery> = {};

	for (const result of results) {
		const oldEntry = oldQueries[result.url];

		if (!result.data && oldEntry?.data) {
			result.data = oldEntry.data;
		}

		newQueries[result.url] = result;
	}

	await kv.put(
		CACHE_KEY,
		JSON.stringify({
			queries: newQueries,
			timestamp: new Date().toISOString()
		})
	);

	return Object.keys(newQueries);
}
