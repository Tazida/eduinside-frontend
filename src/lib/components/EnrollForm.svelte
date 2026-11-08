<script lang="ts">
	import { submitEnrollment, courseImage } from '$lib/api';
	import { formatDate } from '$lib/format';
	import { isEmail, inputClass } from '$lib/validation';
	import type { Course } from '$lib/types';

	let { course }: { course: Course } = $props();

	let name = $state<string>('');
	let email = $state<string>('');
	let phone = $state<string>('');
	let notes = $state<string>('');
	let isSubmitting = $state<boolean>(false);
	let errors = $state<{ name?: string; email?: string }>({});
	let formError = $state<string | null>(null);
	let done = $state<{ message: string; email: string } | null>(null);

	function validate(): boolean {
		errors = {
			name: name.trim() ? undefined : 'Please enter your full name.',
			email: !email.trim()
				? 'Please enter your email address.'
				: isEmail(email)
					? undefined
					: 'Please enter a valid email address.'
		};
		return !errors.name && !errors.email;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		formError = null;
		if (!validate()) return;

		isSubmitting = true;
		try {
			const res = await submitEnrollment({ course_id: course.id, name, email, phone, notes });
			if (res.success) {
				done = { message: res.message, email };
				name = '';
				email = '';
				phone = '';
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

<div class="bg-white rounded-3xl border-2 border-emerald-500/60 shadow-lg overflow-hidden">
	<!-- Course summary -->
	<div class="p-6 sm:p-8 border-b border-slate-100 flex items-center gap-4">
		<img
			src={courseImage(course.image_url)}
			alt=""
			class="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0"
		/>
		<div class="min-w-0 flex-1">
			<h2 class="font-display font-bold text-xl sm:text-2xl text-slate-900">Enroll in this course</h2>
			<p class="text-sm text-slate-500 mt-0.5">
				{course.title}{#if course.batch_starts_at}<span class="hidden sm:inline">{` · Next batch ${formatDate(course.batch_starts_at)}`}</span>{/if}
			</p>
		</div>
		<p class="font-display font-extrabold text-2xl sm:text-3xl text-emerald-700 shrink-0">${course.price}</p>
	</div>

	{#if done}
		<!-- Success replaces the form -->
		<div class="p-6 sm:p-10 text-center" role="status">
			<span class="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
				<i class="fas fa-check text-xl"></i>
			</span>
			<h3 class="font-display font-bold text-xl text-slate-900 mt-4">You're enrolled!</h3>
			<p class="text-slate-600 mt-2 max-w-md mx-auto">{done.message}</p>
			<p class="text-sm text-slate-500 mt-3">
				We've sent the details to <strong class="font-semibold text-slate-700">{done.email}</strong>.
			</p>
			<button
				type="button"
				class="mt-6 text-sm font-medium text-emerald-700 hover:text-emerald-800 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
				onclick={() => (done = null)}
			>
				Enroll someone else
			</button>
		</div>
	{:else}
		<form onsubmit={handleSubmit} novalidate class="p-6 sm:p-8 space-y-4">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="enroll-name" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						Full Name <span class="text-rose-500">*</span>
					</label>
					<input
						type="text"
						id="enroll-name"
						bind:value={name}
						autocomplete="name"
						placeholder="Jane Doe"
						aria-invalid={!!errors.name}
						aria-describedby={errors.name ? 'enroll-name-error' : undefined}
						class={inputClass(!!errors.name)}
					/>
					{#if errors.name}
						<p id="enroll-name-error" class="text-xs text-rose-600 mt-1.5">{errors.name}</p>
					{/if}
				</div>

				<div>
					<label for="enroll-email" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						Email Address <span class="text-rose-500">*</span>
					</label>
					<input
						type="email"
						id="enroll-email"
						bind:value={email}
						autocomplete="email"
						placeholder="jane@example.com"
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? 'enroll-email-error' : undefined}
						class={inputClass(!!errors.email)}
					/>
					{#if errors.email}
						<p id="enroll-email-error" class="text-xs text-rose-600 mt-1.5">{errors.email}</p>
					{/if}
				</div>
			</div>

			<div>
				<label for="enroll-phone" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
					Phone Number (Optional)
				</label>
				<input
					type="tel"
					id="enroll-phone"
					bind:value={phone}
					autocomplete="tel"
					placeholder="+880 1XXX-XXXXXX"
					class={inputClass(false)}
				/>
			</div>

			<div>
				<label for="enroll-notes" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
					Learning Goals & Questions (Optional)
				</label>
				<textarea
					id="enroll-notes"
					bind:value={notes}
					rows="3"
					placeholder="What do you want to achieve with this course?"
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
				class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
			>
				{#if isSubmitting}
					<i class="fas fa-spinner fa-spin text-sm"></i>
					<span>Enrolling...</span>
				{:else}
					<span>Confirm Enrollment — ${course.price}</span>
				{/if}
			</button>
		</form>
	{/if}
</div>
