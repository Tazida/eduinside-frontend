<script lang="ts">
	import { onMount } from 'svelte';
	import { submitInquiry, fetchCategories } from '$lib/api';
	import { isEmail, inputClass } from '$lib/validation';
	import type { Category } from '$lib/types';

	let {
		interest: initialInterest = null,
		title = 'Request a free call back',
		subtitle = 'An advisor will call you within 24 hours — no cost, no obligation.'
	}: { interest?: string | null; title?: string; subtitle?: string } = $props();

	let name = $state<string>('');
	let phone = $state<string>('');
	let email = $state<string>('');
	let interest = $state<string>('');
	let notes = $state<string>('');
	let categories = $state<Category[]>([]);
	let isSubmitting = $state<boolean>(false);
	let errors = $state<{ name?: string; phone?: string; email?: string }>({});
	let formError = $state<string | null>(null);
	let done = $state<{ message: string; phone: string } | null>(null);

	// Preselect the topic passed in (e.g. the course's category on a course page)
	$effect.pre(() => {
		interest = initialInterest ?? '';
	});

	onMount(async () => {
		categories = await fetchCategories();
	});

	function validate(): boolean {
		errors = {
			name: name.trim() ? undefined : 'Please enter your full name.',
			phone: phone.trim() ? undefined : 'Please enter a phone number we can call.',
			email: !email.trim()
				? 'Please enter your email address.'
				: isEmail(email)
					? undefined
					: 'Please enter a valid email address.'
		};
		return !errors.name && !errors.phone && !errors.email;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		formError = null;
		if (!validate()) return;

		const topic = interest || 'Not sure yet';
		isSubmitting = true;
		try {
			const res = await submitInquiry({
				type: 'counselling',
				name,
				phone,
				email,
				subject: `Free counselling: ${topic}`,
				message: notes.trim() || `Interested in: ${topic}`
			});

			if (res.success) {
				done = { message: res.message, phone };
				name = '';
				phone = '';
				email = '';
				notes = '';
			} else {
				formError = res.message;
			}
		} catch {
			formError = 'Network error, please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if done}
	<!-- Success replaces the form -->
	<div class="text-center py-6" role="status">
		<span class="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
			<i class="fas fa-phone-volume text-xl"></i>
		</span>
		<h3 class="font-display font-bold text-xl text-slate-900 mt-4">Request received!</h3>
		<p class="text-slate-600 mt-2">{done.message}</p>
		<p class="text-sm text-slate-500 mt-3">
			We'll call you at <strong class="font-semibold text-slate-700">{done.phone}</strong>.
		</p>
		<button
			type="button"
			class="mt-5 text-sm font-medium text-emerald-700 hover:text-emerald-800 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
			onclick={() => (done = null)}
		>
			Send another request
		</button>
	</div>
{:else}
	<div class="flex items-start gap-3 mb-5">
		<span class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
			<i class="fas fa-headset text-lg"></i>
		</span>
		<div>
			<h3 class="font-display font-bold text-lg text-slate-900">{title}</h3>
			<p class="text-sm text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>
		</div>
	</div>

	<form onsubmit={handleSubmit} novalidate class="space-y-4 text-left">
		<div>
			<label for="counsel-name" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
				Full Name <span class="text-rose-500">*</span>
			</label>
			<input
				type="text"
				id="counsel-name"
				bind:value={name}
				autocomplete="name"
				placeholder="Jane Doe"
				aria-invalid={!!errors.name}
				aria-describedby={errors.name ? 'counsel-name-error' : undefined}
				class={inputClass(!!errors.name)}
			/>
			{#if errors.name}
				<p id="counsel-name-error" class="text-xs text-rose-600 mt-1.5">{errors.name}</p>
			{/if}
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<label for="counsel-phone" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
					Phone <span class="text-rose-500">*</span>
				</label>
				<input
					type="tel"
					id="counsel-phone"
					bind:value={phone}
					autocomplete="tel"
					placeholder="+880 1XXX-XXXXXX"
					aria-invalid={!!errors.phone}
					aria-describedby={errors.phone ? 'counsel-phone-error' : undefined}
					class={inputClass(!!errors.phone)}
				/>
				{#if errors.phone}
					<p id="counsel-phone-error" class="text-xs text-rose-600 mt-1.5">{errors.phone}</p>
				{/if}
			</div>
			<div>
				<label for="counsel-email" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
					Email <span class="text-rose-500">*</span>
				</label>
				<input
					type="email"
					id="counsel-email"
					bind:value={email}
					autocomplete="email"
					placeholder="jane@example.com"
					aria-invalid={!!errors.email}
					aria-describedby={errors.email ? 'counsel-email-error' : undefined}
					class={inputClass(!!errors.email)}
				/>
				{#if errors.email}
					<p id="counsel-email-error" class="text-xs text-rose-600 mt-1.5">{errors.email}</p>
				{/if}
			</div>
		</div>

		<div>
			<label for="counsel-interest" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
				What are you interested in?
			</label>
			<select id="counsel-interest" bind:value={interest} class={inputClass(false)}>
				<option value="">Not sure yet — help me choose</option>
				{#each categories as cat (cat.id)}
					<option value={cat.name}>{cat.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="counsel-notes" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
				Anything you'd like to ask? (Optional)
			</label>
			<textarea
				id="counsel-notes"
				bind:value={notes}
				rows="2"
				placeholder="e.g. I'm a student and want to start freelancing"
				class={inputClass(false)}
			></textarea>
		</div>

		{#if formError}
			<p role="alert" class="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
				<i class="fas fa-circle-exclamation mt-0.5"></i>
				<span>{formError}</span>
			</p>
		{/if}

		<button
			type="submit"
			disabled={isSubmitting}
			class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
		>
			{#if isSubmitting}
				<i class="fas fa-spinner fa-spin text-sm"></i>
				<span>Sending...</span>
			{:else}
				<i class="fas fa-phone text-sm"></i>
				<span>Request a Call Back</span>
			{/if}
		</button>
	</form>
{/if}
