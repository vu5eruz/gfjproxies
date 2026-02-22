import { error } from '@sveltejs/kit';
import { refreshInstancesDataCache } from '$lib/instances';

export async function POST({ platform, request }) {
	const adminKey = platform?.env.ADMIN_KEY;
	if (adminKey === undefined) {
		error(403, 'Forbidden');
	}

	const auth = request.headers.get('authorization') || '';
	if (auth !== `Bearer ${adminKey}`) {
		error(403, 'Missing or invalid admin key token');
	}

	return Response.json({
		urls: await refreshInstancesDataCache(platform!.env.STORAGE)
	});
}
