<script lang="ts">
	import { onMount } from 'svelte';
	import { checkApiHealth } from '$lib/api';

	let isOnline = $state<boolean>(false);
	let mobileMenuOpen = $state<boolean>(false);

	// Not async: an async onMount returns a Promise, so the cleanup would never run
	onMount(() => {
		const refresh = async () => {
			isOnline = await checkApiHealth();
		};
		refresh();
		const interval = setInterval(refresh, 15000);
		return () => clearInterval(interval);
	});
</script>

<header class="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
		<!-- Brand -->
		<a href="/" class="flex items-center gap-2.5 font-display font-bold text-xl text-slate-900 tracking-tight">
			<img src="/images/logoi.png" alt="EduInside Logo" class="w-8 h-8 object-contain" />
			<span>EduInside</span>
		</a>

		<!-- Desktop Navigation -->
		<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
			<a href="/#home" class="hover:text-emerald-700 transition-colors">Home</a>
			<a href="/#about" class="hover:text-emerald-700 transition-colors">About</a>
			<a href="/#courses" class="hover:text-emerald-700 transition-colors">Courses</a>
			<a href="/#faq" class="hover:text-emerald-700 transition-colors">FAQ</a>
			<a href="/#contact" class="hover:text-emerald-700 transition-colors">Contact</a>
		</nav>

		<!-- Right Action & API Status -->
		<div class="flex items-center gap-3">
			{#if isOnline}
				<span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
					<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
					API Connected
				</span>
			{:else}
				<span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200" title="Backend runner: cd ../eduinside-backend && npm run dev">
					<span class="w-2 h-2 rounded-full bg-amber-500"></span>
					Local Mode
				</span>
			{/if}

			<a
				href="/#courses"
				class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow"
			>
				Browse Courses
			</a>

			<!-- Mobile Menu Toggle -->
			<button
				type="button"
				aria-label="Toggle navigation menu"
				class="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
			>
				<i class="fas {mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg"></i>
			</button>
		</div>
	</div>

	<!-- Mobile Menu Dropdown -->
	{#if mobileMenuOpen}
		<div class="md:hidden bg-white border-b border-slate-100 px-4 pt-3 pb-5 space-y-2 text-sm font-medium animate-in slide-in-from-top-2 duration-150">
			<a href="/#home" class="block py-2 text-slate-700 hover:text-emerald-600" onclick={() => mobileMenuOpen = false}>Home</a>
			<a href="/#about" class="block py-2 text-slate-700 hover:text-emerald-600" onclick={() => mobileMenuOpen = false}>About</a>
			<a href="/#courses" class="block py-2 text-slate-700 hover:text-emerald-600" onclick={() => mobileMenuOpen = false}>Courses</a>
			<a href="/#faq" class="block py-2 text-slate-700 hover:text-emerald-600" onclick={() => mobileMenuOpen = false}>FAQ</a>
			<a href="/#contact" class="block py-2 text-slate-700 hover:text-emerald-600" onclick={() => mobileMenuOpen = false}>Contact</a>
			<div class="pt-2 border-t border-slate-100 flex items-center justify-between">
				<span class="text-xs text-slate-500">
					{isOnline ? '🟢 API Online' : '🟡 Local Mode'}
				</span>
			</div>
		</div>
	{/if}
</header>
