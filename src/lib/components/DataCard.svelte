<script lang="ts">
	import type { InstanceDataQuery } from '$lib/instances';
	import { formatDuration, formatMebibytes, formatRelativeTime } from '$lib/utils';
	import DataChip from './DataChip.svelte';

	export let instance: InstanceDataQuery;
</script>

<div class="flex flex-col rounded-xl bg-slate-100 px-4 py-2">
	<div class="flex flex-wrap items-baseline text-xl">
		<a rel="external" href={instance.url} class="flex-1 text-cyan-600 hover:text-cyan-400"
			>{instance.url}</a
		>
		<span
			class="content-center rounded-xl px-3 py-1 font-bold text-white"
			class:bg-green-400={instance.status === 200}
			class:bg-red-400={instance.status !== 200}
			>{instance.status === 200 ? 'ACTIVE' : 'ERROR'}</span
		>
	</div>
	<div class="border-b-2 border-slate-300 pb-2">
		<span class="text-slate-500">Hosted by</span>
		<span class="rounded-xl bg-slate-500 px-3 py-0.5 text-white">{instance.data.admin}</span>
	</div>
	<div class="my-2 flex flex-wrap gap-2">
		<DataChip label="bandwidth" value={formatMebibytes(instance.data.bandwidth)} />
		<DataChip label="bwarning" value={formatMebibytes(instance.data.bwarning)} />
		<DataChip label="cooldown" value={formatDuration(instance.data.cooldown)} />
		<DataChip label="cpolicy" value={instance.data.cpolicy} />
		<DataChip label="keyspace" value={instance.data.keyspace.toLocaleString('en')} />
		<DataChip label="uptime" value={formatDuration(instance.data.uptime, { expanded: true })} />
		<DataChip label="version" value={instance.data.version} />
	</div>
	<div class="mt-auto flex flex-wrap border-t-2 border-slate-300 pt-2">
		<div class="whitespace-nowrap">
			<span class="text-green-600">{instance.status} {instance.statusText}</span>
			<span class="text-lime-600">({(instance.timingMs / 1000).toFixed(2)}s)</span>
		</div>
		<div class="ms-auto whitespace-nowrap">
			<span class="text-slate-500">Last checked</span>
			<span class="text-slate-800">{formatRelativeTime(instance.timestamp)}</span>
		</div>
	</div>
</div>
