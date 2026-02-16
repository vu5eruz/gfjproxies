<script lang="ts">
	import DataCard from '$lib/components/DataCard.svelte';
	import { formatRelativeTime } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<header class="border-b-4 border-slate-100 p-4">
	<h1 class="text-4xl font-bold tracking-tight text-slate-800">gfjproxies</h1>
	<aside class="mt-2">GeminiForJanitor Public Proxy List</aside>
</header>

<main
	class="grid max-w-full flex-1 grid-cols-1 gap-4 px-4 py-2"
	class:lg:grid-cols-2={data.instances.length > 0}
>
	{#each data.instances as instance (instance.url)}
		<DataCard {instance} />
	{:else}
		<div class="flex flex-col bg-slate-100 m-auto rounded-xl text-center px-4 py-2">
			<span class="text-6xl text-slate-800">X_X</span>
			<span class="pt-6">No instances yet.</span>
		</div>
	{/each}
</main>

<footer class="flex flex-row border-t-4 border-slate-100 p-4">
	<div class="flex flex-1 flex-col">
		<span class="text-slate-500">List last updated</span>
		<span class="text-slate-800"
			>{data.timestamp ? formatRelativeTime(data.timestamp) : 'not yet'}</span
		>
	</div>
	<div class="flex flex-col gap-2">
		<div class="ml-auto flex flex-wrap items-baseline justify-end gap-2 text-right">
			<span>Made by</span>
			<a
				class="rounded-xl bg-purple-600 px-3 py-0.5 text-white"
				href="https://janitorai.com/profiles/c6bf0650-7298-4fd0-8371-ca6e3f107dd8_profile-of-undefinedundefined"
				>@undefinedundefined</a
			>
		</div>
		<div class="ml-auto flex flex-wrap items-baseline justify-end gap-2 text-right">
			<span>Discord</span>
			<span class="rounded-xl bg-blue-500 px-3 py-0.5 text-white">undefined_anon</span>
			<span>GitHub</span>
			<a class="rounded-xl bg-cyan-500 px-3 py-0.5 text-white" href="https://github.com/vu5eruz"
				>vu5eruz</a
			>
		</div>
	</div>
</footer>
