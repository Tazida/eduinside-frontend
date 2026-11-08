<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchFaqs } from '$lib/api';
	import type { Faq } from '$lib/types';

	let faqs = $state<Faq[]>([]);
	let openFaqId = $state<number | null>(1);

	onMount(async () => {
		faqs = await fetchFaqs();
	});

	function toggleFaq(id: number) {
		openFaqId = openFaqId === id ? null : id;
	}
</script>

<section id="faq" class="py-16 md:py-24 bg-white border-t border-slate-100">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center mb-12">
			<span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
				Q&A Hub
			</span>
			<h2 class="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
				Answer Any <span class="text-emerald-600">Question</span>
			</h2>
			<p class="text-slate-600 text-base mt-2 max-w-xl mx-auto">
				You can now ask and answer any questions live with our instructors and community.
			</p>
		</div>

		<!-- Accordion List -->
		<div class="space-y-4">
			{#each faqs as faq (faq.id)}
				<div class="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 {openFaqId === faq.id ? 'border-emerald-500 shadow-sm' : 'hover:border-slate-300'}">
					<button
						type="button"
						class="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg {openFaqId === faq.id ? 'text-emerald-700 bg-emerald-50/40' : 'text-slate-800 bg-white hover:bg-slate-50/50'}"
						onclick={() => toggleFaq(faq.id)}
					>
						<span>{faq.question}</span>
						<span class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs transition-transform duration-200 {openFaqId === faq.id ? 'rotate-180 bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
							<i class="fas fa-chevron-down"></i>
						</span>
					</button>

					{#if openFaqId === faq.id}
						<div class="p-5 sm:p-6 text-slate-600 text-sm sm:text-base leading-relaxed bg-white border-t border-slate-100 animate-in fade-in duration-150">
							{faq.answer}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

