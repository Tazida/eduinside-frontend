<script lang="ts">
	import { submitInquiry } from '$lib/api';
	import { isEmail } from '$lib/validation';

	let contactName = $state<string>('');
	let contactEmail = $state<string>('');
	let contactMessage = $state<string>('');
	let isSending = $state<boolean>(false);
	let formError = $state<string | null>(null);
	let sentMessage = $state<string | null>(null);

	async function handleContact(e: Event) {
		e.preventDefault();
		formError = null;
		if (!contactName.trim() || !contactMessage.trim() || !isEmail(contactEmail)) {
			formError = 'Please enter your name, a valid email and a message.';
			return;
		}

		isSending = true;
		try {
			const res = await submitInquiry({
				name: contactName,
				email: contactEmail,
				message: contactMessage,
				subject: 'Website Footer Contact'
			});
			if (res.success) {
				sentMessage = res.message;
				contactName = '';
				contactEmail = '';
				contactMessage = '';
			} else {
				formError = res.message;
			}
		} catch {
			formError = 'Network error, please try again.';
		} finally {
			isSending = false;
		}
	}
</script>

<footer id="contact" class="bg-[#0a1f0e] text-slate-300 pt-16 pb-12 border-t border-emerald-950">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16 border-b border-emerald-900/50">
			<!-- Brand and Socials -->
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					<img src="/images/logoi.png" alt="EduInside Logo" class="w-10 h-10 object-contain brightness-125" />
					<span class="font-display font-extrabold text-2xl text-white tracking-tight">EduInside</span>
				</div>

				<p class="text-slate-400 text-sm max-w-sm leading-relaxed">
					Empowering learners worldwide with cutting-edge digital skills, industry-certified mentors, and project-based certifications.
				</p>

				<div>
					<h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Connect With Us</h4>
					<div class="flex items-center gap-3">
						<a href="https://facebook.com" aria-label="Visit Facebook" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all">
							<i class="fab fa-facebook-f text-sm"></i>
						</a>
						<a href="https://instagram.com" aria-label="Visit Instagram" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all">
							<i class="fab fa-instagram text-sm"></i>
						</a>
						<a href="https://twitter.com" aria-label="Visit Twitter" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all">
							<i class="fab fa-twitter text-sm"></i>
						</a>
						<a href="https://tiktok.com" aria-label="Visit TikTok" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all">
							<i class="fab fa-tiktok text-sm"></i>
						</a>
					</div>
				</div>
			</div>

			<!-- Direct Contact / Message Form -->
			<div class="bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/10">
				<h3 class="font-display font-bold text-xl text-white mb-2">Send us a Message</h3>
				<p class="text-xs text-slate-400 mb-5">Have questions about admissions, partnerships, or scholarships?</p>

				{#if sentMessage}
					<!-- Success replaces the form -->
					<div class="text-center py-6" role="status">
						<span class="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
							<i class="fas fa-check text-lg"></i>
						</span>
						<p class="font-display font-bold text-lg text-white mt-4">Message sent!</p>
						<p class="text-sm text-slate-400 mt-1">{sentMessage}</p>
						<button
							type="button"
							class="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
							onclick={() => (sentMessage = null)}
						>
							Send another message
						</button>
					</div>
				{:else}
					<form onsubmit={handleContact} novalidate class="space-y-3.5">
						<div>
							<input
								type="text"
								bind:value={contactName}
								aria-label="Your name"
								autocomplete="name"
								placeholder="Your Name"
								class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
						<div>
							<input
								type="email"
								bind:value={contactEmail}
								aria-label="Your email"
								autocomplete="email"
								placeholder="Your Email"
								class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
						<div>
							<textarea
								bind:value={contactMessage}
								aria-label="Your message"
								rows="3"
								placeholder="Your Message..."
								class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
							></textarea>
						</div>

						{#if formError}
							<p role="alert" class="flex items-start gap-2 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5">
								<i class="fas fa-circle-exclamation mt-0.5"></i>
								<span>{formError}</span>
							</p>
						{/if}

						<button
							type="submit"
							disabled={isSending}
							class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
						>
							{isSending ? 'Sending...' : 'Send Message'}
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Footer Bottom -->
		<div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
			<p>© {new Date().getFullYear()} EduInside. All rights reserved.</p>
			<p>Designed with care for modern education.</p>
		</div>
	</div>
</footer>
