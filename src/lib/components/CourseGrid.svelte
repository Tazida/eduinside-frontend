<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchCourses, fetchCategories } from '$lib/api';
	import type { Course, Category } from '$lib/types';
	import CourseCard from './CourseCard.svelte';

	let courses = $state<Course[]>([]);
	let categories = $state<Category[]>([]);
	let selectedCategory = $state<string>('all');
	let searchQuery = $state<string>('');
	let sortBy = $state<string>('default');
	let isLoading = $state<boolean>(true);

	async function loadData() {
		isLoading = true;
		try {
			[courses, categories] = await Promise.all([
				fetchCourses(selectedCategory, searchQuery),
				fetchCategories()
			]);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		loadData();
	});

	function handleCategoryClick(slug: string) {
		selectedCategory = slug;
		loadData();
	}

	let debounceTimer: ReturnType<typeof setTimeout>;
	function handleSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			searchQuery = target.value;
			loadData();
		}, 300);
	}

	let sortedCourses = $derived(() => {
		let list = [...courses];
		if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
		if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
		if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
		return list;
	});
</script>

<section id="courses" class="py-16 md:py-24 bg-[#fafcfc]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="max-w-3xl mx-auto text-center mb-12">
			<h2 class="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
				Build Your <span class="text-emerald-600">Career</span>
			</h2>
			<p class="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
				Your career is like a garden. It can hold an assortment of life's energy that yields a bounty for you. You do not need to do just one thing in your career.
			</p>
		</div>

		<!-- Search & Filter Controls -->
		<div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
			<!-- Search Bar -->
			<div class="relative w-full md:w-96">
				<i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
				<input
					type="text"
					placeholder="Search courses, instructors, topics..."
					class="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs"
					oninput={handleSearchInput}
				/>
			</div>

			<!-- Sort Dropdown -->
			<div class="flex items-center gap-2 self-end md:self-auto text-sm text-slate-600">
				<span>Sort by:</span>
				<select
					bind:value={sortBy}
					class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
				>
					<option value="default">Featured</option>
					<option value="price-low">Price: Low to High</option>
					<option value="price-high">Price: High to Low</option>
					<option value="rating">Top Rated</option>
				</select>
			</div>
		</div>

		<!-- Category Filter Pills -->
		<div class="flex flex-wrap items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
			<button
				type="button"
				class="px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs {selectedCategory === 'all'
					? 'bg-emerald-600 text-white shadow-emerald-500/20'
					: 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}"
				onclick={() => handleCategoryClick('all')}
			>
				All Categories
			</button>
			{#each categories as cat}
				<button
					type="button"
					class="px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs {selectedCategory === cat.slug
						? 'bg-emerald-600 text-white shadow-emerald-500/20'
						: 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}"
					onclick={() => handleCategoryClick(cat.slug)}
				>
					{cat.name}
				</button>
			{/each}
		</div>

		<!-- Courses Grid -->
		{#if isLoading}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each Array(6) as _}
					<div class="bg-white rounded-3xl p-5 border border-slate-100 animate-pulse flex gap-4 h-40">
						<div class="w-32 h-32 bg-slate-200 rounded-2xl shrink-0"></div>
						<div class="flex-1 space-y-3 py-2">
							<div class="h-4 bg-slate-200 rounded-md w-3/4"></div>
							<div class="h-3 bg-slate-200 rounded-md w-full"></div>
							<div class="h-3 bg-slate-200 rounded-md w-2/3"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if sortedCourses().length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each sortedCourses() as course (course.id)}
					<CourseCard {course} />
				{/each}
			</div>
		{:else}
			<div class="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto">
				<i class="fas fa-graduation-cap text-4xl text-slate-300 mb-3"></i>
				<h3 class="font-display font-bold text-lg text-slate-700">No courses match your query</h3>
				<p class="text-sm text-slate-500 mt-1">Try clearing your search or switching categories.</p>
				<button
					type="button"
					class="mt-4 px-4 py-2 rounded-xl text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
					onclick={() => {
						searchQuery = '';
						selectedCategory = 'all';
						loadData();
					}}
				>
					Reset Filters
				</button>
			</div>
		{/if}
	</div>
</section>

