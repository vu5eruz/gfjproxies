import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import cloudflareAppendTrigger from './scripts/cloudflare-append-trigger';

export default defineConfig({ plugins: [tailwindcss(), sveltekit(), cloudflareAppendTrigger()] });
