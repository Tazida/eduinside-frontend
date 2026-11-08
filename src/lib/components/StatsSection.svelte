<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchStats } from '$lib/api';
	import type { Stats } from '$lib/types';

	let stats = $state<Stats>({
		total_students: 20000,
		total_instructors: 200,
		total_courses: 6,
		total_categories: 6,
		satisfaction_rate: 99.4
	});

	onMount(async () => {
		stats = await fetchStats();
	});
</script>

<section class="py-10 bg-white border-y border-slate-100">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
			<div class="p-4 rounded-2xl bg-emerald-50/50">
				<div class="font-display font-extrabold text-3xl sm:text-4xl text-emerald-700">
					{stats.total_students.toLocaleString()}+
				</div>
				<div class="text-sm font-medium text-slate-600 mt-1">Active Students</div>
			</div>
			<div class="p-4 rounded-2xl bg-blue-50/50">
				<div class="font-display font-extrabold text-3xl sm:text-4xl text-blue-700">
					{stats.total_instructors}+
				</div>
				<div class="text-sm font-medium text-slate-600 mt-1">Expert Mentors</div>
			</div>
			<div class="p-4 rounded-2xl bg-amber-50/50">
				<div class="font-display font-extrabold text-3xl sm:text-4xl text-amber-700">
					{stats.total_courses}
				</div>
				<div class="text-sm font-medium text-slate-600 mt-1">Core Specializations</div>
			</div>
			<div class="p-4 rounded-2xl bg-purple-50/50">
				<div class="font-display font-extrabold text-3xl sm:text-4xl text-purple-700">
					{stats.satisfaction_rate}%
				</div>
				<div class="text-sm font-medium text-slate-600 mt-1">Completion Rate</div>
			</div>
		</div>
	</div>
</section>

