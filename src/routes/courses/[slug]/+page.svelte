<script lang="ts">
	import { page } from '$app/state';
	import { fetchCourse, courseImage } from '$lib/api';
	import { formatDate, daysUntil } from '$lib/format';
	import EnrollForm from '$lib/components/EnrollForm.svelte';
	import CounsellingForm from '$lib/components/CounsellingForm.svelte';
	import type { Course } from '$lib/types';

	let course = $state<Course | null>(null);
	let isLoading = $state<boolean>(true);
	let openModule = $state<number | null>(0);

	// (Re)load whenever the slug in the URL changes
	$effect(() => {
		const slug = page.params.slug;
		if (!slug) return;

		let cancelled = false;
		isLoading = true;
		openModule = 0;
		fetchCourse(slug).then((result) => {
			if (cancelled) return;
			course = result;
			isLoading = false;
		});
		return () => {
			cancelled = true;
		};
	});

	const lessonCount = $derived(
		course?.curriculum?.reduce((total, m) => total + (m.lessons?.length ?? 0), 0) ?? 0
	);
	const startsIn = $derived(daysUntil(course?.batch_starts_at));
	const instructorInitials = $derived(
		(course?.instructor || 'EduInside')
			.split(' ')
			.map((part) => part[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
	);

	function toggleModule(index: number) {
		openModule = openModule === index ? null : index;
	}
</script>

<svelte:head>
	<title>{course ? `${course.title} — EduInside` : 'Course — EduInside'}</title>
	{#if course}
		<meta name="description" content={course.description} />
	{/if}
</svelte:head>

{#if isLoading}
	<!-- Loading skeleton -->
	<section class="pt-28 pb-12 bg-[#0a1f0e]">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-4">
			<div class="h-3 w-40 bg-white/10 rounded"></div>
			<div class="h-9 w-2/3 bg-white/10 rounded-lg"></div>
			<div class="h-4 w-1/2 bg-white/10 rounded"></div>
		</div>
	</section>
	<section class="py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_360px] gap-10 animate-pulse">
			<div class="space-y-4">
				<div class="h-48 bg-slate-200 rounded-3xl"></div>
				<div class="h-64 bg-slate-200 rounded-3xl"></div>
			</div>
			<div class="h-96 bg-slate-200 rounded-3xl"></div>
		</div>
	</section>
{:else if !course}
	<!-- Not found -->
	<section class="pt-36 pb-24">
		<div class="max-w-lg mx-auto px-4 text-center">
			<span class="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
				<i class="fas fa-graduation-cap text-2xl"></i>
			</span>
			<h1 class="font-display font-extrabold text-2xl text-slate-900 mt-5">Course not found</h1>
			<p class="text-slate-600 mt-2">This course may have been removed, or the link is incorrect.</p>
			<a
				href="/#courses"
				class="inline-flex items-center gap-2 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
			>
				<i class="fas fa-arrow-left text-xs"></i> Browse all courses
			</a>
		</div>
	</section>
{:else}
	<!-- Course header -->
	<section class="pt-28 pb-12 md:pb-14 bg-gradient-to-br from-[#0a1f0e] via-emerald-950 to-slate-900 text-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-xs text-emerald-200/80">
				<a href="/" class="hover:text-white transition-colors">Home</a>
				<i class="fas fa-chevron-right text-[9px] opacity-60"></i>
				<a href="/#courses" class="hover:text-white transition-colors">Courses</a>
				{#if course.category}
					<i class="fas fa-chevron-right text-[9px] opacity-60"></i>
					<span class="text-emerald-100">{course.category.name}</span>
				{/if}
			</nav>

			<div class="max-w-3xl mt-5">
				<h1 class="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">
					{course.title}
				</h1>
				<p class="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">{course.description}</p>

				<div class="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm text-slate-300">
					<span class="flex items-center gap-1.5 text-amber-400 font-semibold">
						<i class="fas fa-star text-xs"></i>{Number(course.rating).toFixed(1)}
					</span>
					<span><i class="fas fa-user-group text-emerald-400 me-1.5 text-xs"></i>{course.students_count.toLocaleString()} students</span>
					<span><i class="fas fa-chalkboard-user text-emerald-400 me-1.5 text-xs"></i>{course.instructor || 'EduInside Faculty'}</span>
					{#if course.level}
						<span><i class="fas fa-signal text-emerald-400 me-1.5 text-xs"></i>{course.level}</span>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Body -->
	<section class="py-10 md:py-14">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
			<!-- Enroll card (first on mobile, sticky sidebar on desktop) -->
			<aside class="lg:order-2 lg:sticky lg:top-24">
				<div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
					<img
						src={courseImage(course.image_url)}
						alt={course.title}
						class="w-full aspect-video object-cover bg-slate-100"
						onerror={(e) => {
							(e.currentTarget as HTMLImageElement).src = '/images/logoi.png';
						}}
					/>
					<div class="p-6">
						<div class="flex items-end justify-between gap-3">
							<p class="font-display font-extrabold text-4xl text-slate-900">${course.price}</p>
							{#if startsIn !== null && startsIn >= 0}
								<span class="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
									{startsIn === 0 ? 'Starts today' : `Starts in ${startsIn} day${startsIn === 1 ? '' : 's'}`}
								</span>
							{/if}
						</div>

						<ul class="mt-5 space-y-3 text-sm text-slate-600">
							{#if course.batch_starts_at}
								<li class="flex items-start gap-3">
									<i class="far fa-calendar text-emerald-600 w-4 mt-0.5"></i>
									<span><span class="text-slate-400">Next batch:</span> <strong class="font-semibold text-slate-800">{formatDate(course.batch_starts_at)}</strong></span>
								</li>
							{/if}
							{#if course.schedule}
								<li class="flex items-start gap-3">
									<i class="fas fa-video text-emerald-600 w-4 mt-0.5"></i>
									<span><span class="text-slate-400">Live classes:</span> {course.schedule}</span>
								</li>
							{/if}
							<li class="flex items-start gap-3">
								<i class="far fa-clock text-emerald-600 w-4 mt-0.5"></i>
								<span><span class="text-slate-400">Duration:</span> {course.duration || 'Self-paced'}</span>
							</li>
							{#if course.curriculum?.length}
								<li class="flex items-start gap-3">
									<i class="fas fa-list-check text-emerald-600 w-4 mt-0.5"></i>
									<span>{course.curriculum.length} modules · {lessonCount} lessons</span>
								</li>
							{/if}
						</ul>

						<!-- Both jump to the inline forms further down the page -->
						<a
							href="#enroll"
							class="block text-center mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-emerald-600/30"
						>
							Enroll Now
						</a>
						<a
							href="#counselling"
							class="block text-center mt-3 w-full text-sm font-medium text-emerald-700 hover:text-emerald-800 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
						>
							<i class="fas fa-headset me-1.5"></i> Not sure? Get free counselling
						</a>
					</div>
				</div>
			</aside>

			<!-- Main content -->
			<div class="lg:order-1 min-w-0 space-y-8">
				{#if course.outcomes?.length}
					<div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
						<h2 class="font-display font-bold text-xl sm:text-2xl text-slate-900">What you'll learn</h2>
						<ul class="grid sm:grid-cols-2 gap-x-6 gap-y-3 mt-5">
							{#each course.outcomes as outcome (outcome)}
								<li class="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
									<i class="fas fa-check text-emerald-600 mt-1 text-xs"></i>
									<span>{outcome}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if course.curriculum?.length}
					<div>
						<div class="flex flex-wrap items-end justify-between gap-2 mb-4">
							<h2 class="font-display font-bold text-xl sm:text-2xl text-slate-900">Course curriculum</h2>
							<p class="text-sm text-slate-500">{course.curriculum.length} modules · {lessonCount} lessons</p>
						</div>

						<div class="space-y-3">
							{#each course.curriculum as module, index (index)}
								<div class="bg-white border rounded-2xl overflow-hidden transition-colors {openModule === index ? 'border-emerald-500' : 'border-slate-200'}">
									<button
										type="button"
										class="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
										aria-expanded={openModule === index}
										onclick={() => toggleModule(index)}
									>
										<span class="min-w-0">
											<span class="block text-xs font-semibold uppercase tracking-wider text-emerald-700">Module {index + 1}</span>
											<span class="block font-semibold text-slate-900 mt-0.5">{module.title}</span>
										</span>
										<span class="flex items-center gap-3 shrink-0 text-xs text-slate-500">
											{module.lessons?.length ?? 0} lessons
											<i class="fas fa-chevron-down transition-transform duration-200 {openModule === index ? 'rotate-180 text-emerald-600' : ''}"></i>
										</span>
									</button>

									{#if openModule === index && module.lessons?.length}
										<ul class="border-t border-slate-100 px-5 py-3 space-y-1">
											{#each module.lessons as lesson (lesson)}
												<li class="flex items-center gap-3 py-1.5 text-sm text-slate-600">
													<i class="far fa-circle-play text-slate-400"></i>
													<span>{lesson}</span>
												</li>
											{/each}
										</ul>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Instructor -->
				<div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
					<h2 class="font-display font-bold text-xl sm:text-2xl text-slate-900">Your instructor</h2>
					<div class="flex items-center gap-4 mt-5">
						<span class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-display font-bold text-lg flex items-center justify-center shrink-0">
							{instructorInitials}
						</span>
						<div>
							<p class="font-semibold text-slate-900">{course.instructor || 'EduInside Faculty'}</p>
							<p class="text-sm text-slate-500">{course.category?.name ?? 'EduInside'} instructor</p>
						</div>
					</div>
				</div>

				<!-- Inline enrollment form -->
				<div id="enroll" class="scroll-mt-24">
					<EnrollForm {course} />
				</div>

				<!-- Inline counselling form, with this course's topic preselected -->
				<div id="counselling" class="scroll-mt-24 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
					<CounsellingForm
						interest={course.category?.name}
						title="Not sure this course is right for you?"
						subtitle="Talk to a career advisor for free. We'll call you within 24 hours."
					/>
				</div>
			</div>
		</div>
	</section>
{/if}
