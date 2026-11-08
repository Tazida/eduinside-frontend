<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import StatsSection from '$lib/components/StatsSection.svelte';
	import CourseGrid from '$lib/components/CourseGrid.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import CounsellingForm from '$lib/components/CounsellingForm.svelte';
</script>

<Hero />
<StatsSection />
<CourseGrid />

<!-- Free counselling: for visitors who have not picked a course yet -->
<section id="counselling" class="py-12 bg-white scroll-mt-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white grid lg:grid-cols-[1fr_440px] gap-8 lg:gap-12 items-center shadow-xl relative overflow-hidden">
			<div class="relative z-10">
				<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 border border-white/20">
					<i class="fas fa-headset"></i> Free career counselling
				</span>
				<h2 class="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mt-4">
					Not Sure Which Course Is Right for You?
				</h2>
				<p class="text-blue-100 text-base mt-3 max-w-xl">
					Talk to a career advisor for free. Tell us your goals and we'll help you pick the right course.
				</p>
				<ul class="mt-6 space-y-3 text-sm sm:text-base">
					<li class="flex items-center gap-3">
						<i class="fas fa-circle-check text-emerald-400"></i> A free call with a career advisor
					</li>
					<li class="flex items-center gap-3">
						<i class="fas fa-circle-check text-emerald-400"></i> A course recommendation based on your goals
					</li>
					<li class="flex items-center gap-3">
						<i class="fas fa-circle-check text-emerald-400"></i> No cost, no obligation
					</li>
				</ul>
			</div>

			<div class="relative z-10 bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
				<CounsellingForm />
			</div>

			<!-- Background graphic decoration -->
			<div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
			<div class="absolute left-1/3 -top-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"></div>
		</div>
	</div>
</section>

<FaqSection />
