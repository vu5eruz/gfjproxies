// https://github.com/zekele-win/zekele-fed/blob/2f939b6e959998ef1777254b63d928d5155c87b2/scripts/cloudflare-append-trigger.ts

/**
 * Vite plugin that appends the Cloudflare `scheduled` handler
 *   to the generated `_worker.js` entry after build.
 *
 * This is required because SvelteKit does not expose the
 *   scheduled handler by default in the Cloudflare worker entry.
 */

import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export default function plugin(): Plugin {
	return {
		name: 'vite-append-trigger',

		/**
		 * Runs after Vite finishes bundling.
		 * Appends the scheduled handler to Cloudflare worker entry
		 *   so cron triggers can call it.
		 */
		closeBundle(error?: Error) {
			// Abort if build failed
			if (error) return;

			// Path to the generated Cloudflare worker entry
			const workerPath = path.resolve(__dirname, '../.svelte-kit/cloudflare/_worker.js');

			// Skip if Cloudflare adapter output does not exist
			if (!fs.existsSync(workerPath)) {
				console.warn('❌ _worker.js not found, skipping scheduled append.');
				return;
			}

			// Read generated worker content
			let content = fs.readFileSync(workerPath, 'utf-8');

			// Import the scheduled function from the compiled hooks file
			//   and attach it to the worker default export.
			// This enables Cloudflare cron triggers to invoke it.
			content += `
import { scheduled } from "../output/server/entries/hooks.server.js"
worker_default.scheduled = scheduled;
`;

			// Write back the modified worker entry
			fs.writeFileSync(workerPath, content, 'utf-8');
			console.log('✅ Scheduled function appended to _worker.js');
		}
	};
}
