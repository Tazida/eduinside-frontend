<script lang="ts">
	let activeSlide = $state<number>(0);

	const slides = [
		{
			image: '/images/cover/cover-1.png',
			badge: 'World-Class Learning',
			title: 'The Best eLearning Platform',
			subtitle: 'Join over 20,000 students and 200 industry-expert instructors empowering next-generation tech skills.'
		},
		{
			image: '/images/cover/cover-2.jpg',
			badge: 'Community First',
			title: 'Meet Your New Community',
			subtitle: 'Collaborate with passionate developers, designers, and marketers building practical digital careers.'
		},
		{
			image: '/images/cover/cover-3.jpg',
			badge: 'Career Acceleration',
			title: 'Grow With Quality Education',
			subtitle: 'Turn ambition into competence with hands-on curriculums, mentor reviews, and verified portfolios.'
		}
	];

	function nextSlide() {
		activeSlide = (activeSlide + 1) % slides.length;
	}

	function prevSlide() {
		activeSlide = (activeSlide - 1 + slides.length) % slides.length;
	}
</script>

<section id="home" class="relative pt-24 pb-12 md:py-32 overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 min-h-[460px] md:min-h-[520px] flex items-center">
			<!-- Background Image -->
			{#each slides as slide, index}
				<div
					class="absolute inset-0 transition-opacity duration-700 ease-in-out {activeSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
				>
					<img
						src={slide.image}
						alt={slide.title}
						class="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000 ease-out"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
				</div>
			{/each}

			<!-- Slide Content -->
			<div class="relative z-10 max-w-3xl mx-auto text-center px-6 py-12 md:py-20 text-white">
				<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-6 backdrop-blur-md">
					<i class="fas fa-sparkles"></i>
					<span>{slides[activeSlide].badge}</span>
				</div>

				<h1 class="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-tight mb-5">
					{slides[activeSlide].title}
				</h1>

				<p class="text-base sm:text-lg md:text-xl text-slate-200/90 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
					{slides[activeSlide].subtitle}
				</p>

				<div class="flex flex-wrap items-center justify-center gap-4">
					<a
						href="#courses"
						class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 text-base"
					>
						Explore Courses
					</a>
					<a
						href="#counselling"
						class="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-2xl transition-all border border-white/20 backdrop-blur-md text-base"
					>
						<i class="fas fa-headset me-2"></i>Free Counselling
					</a>
				</div>
			</div>

			<!-- Carousel Navigation Arrows -->
			<button
				type="button"
				class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
				onclick={prevSlide}
				aria-label="Previous slide"
			>
				<i class="fas fa-chevron-left"></i>
			</button>
			<button
				type="button"
				class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
				onclick={nextSlide}
				aria-label="Next slide"
			>
				<i class="fas fa-chevron-right"></i>
			</button>

			<!-- Carousel Indicators -->
			<div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
				{#each slides as _, index}
					<button
						type="button"
						class="h-2 rounded-full transition-all duration-300 {activeSlide === index ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'}"
						onclick={() => activeSlide = index}
						aria-label="Go to slide {index + 1}"
					></button>
				{/each}
			</div>
		</div>
	</div>
</section>

