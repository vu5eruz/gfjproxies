// https://github.com/zekele-win/zekele-fed/blob/2f939b6e959998ef1777254b63d928d5155c87b2/src/hooks.server.ts (modified)

// -----------------------------------------------------------------------------
// Cloudflare Workers scheduled entry
// -----------------------------------------------------------------------------
//
// NOTE:
// This function is intentionally defined here and NOT obfuscated.
// It is used as a stable entry point for a custom Vite plugin to inject
//   into Cloudflare's `_worker.js` during build time.

import type { ScheduledController, ExecutionContext } from '@cloudflare/workers-types';
import { refreshInstancesDataCache } from '$lib/instances';

/**
 * Cloudflare Workers scheduled task.
 *
 * - Triggered by cron schedules defined in wrangler configuration.
 * - Refreshes and caches FedWatch-related data asynchronously.
 * - Uses `ctx.waitUntil` to avoid blocking the worker lifecycle.
 */
export const scheduled = async (
	controller: ScheduledController,
	env: Cloudflare.Env,
	ctx: ExecutionContext
) => {
	ctx.waitUntil(refreshInstancesDataCache(env.STORAGE));
};
