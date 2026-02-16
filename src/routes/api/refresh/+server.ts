import { error } from '@sveltejs/kit';
import { refreshInstancesDataCache } from '$lib/instances';

export async function POST({ platform, request }) {
	const auth = request.headers.get('authorization') || '';
	if (auth !== `Bearer ${platform!.env.ADMIN_KEY}`) {
		error(403, 'Missing or invalid admin key token');
	}

	return Response.json({
		urls: await refreshInstancesDataCache(platform!.env.STORAGE)
	});
}
