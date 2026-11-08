<script lang="ts">
	import type { Course } from '$lib/types';
	import { courseImage } from '$lib/api';

	let { course }: { course: Course } = $props();
</script>

<!-- The whole card opens the course details page, where enrollment happens -->
<a
	href="/courses/{course.slug}"
	class="group bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col sm:flex-row items-center gap-5"
>
	<!-- Course Thumbnail -->
	<div class="relative shrink-0 w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-slate-100">
		<img
			src={courseImage(course.image_url)}
			alt={course.title}
			class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
			onerror={(e) => {
				const img = e.currentTarget as HTMLImageElement;
				img.src = '/images/logoi.png';
			}}
		/>
		<span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
			${course.price}
		</span>
	</div>

	<!-- Course Content -->
	<div class="flex-1 w-full flex flex-col justify-between">
		<div>
			<div class="flex items-center justify-between gap-2 mb-1.5">
				<span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
					{course.category?.name || 'Technology'}
				</span>
				<div class="flex items-center text-xs text-amber-500 font-semibold gap-1">
					<i class="fas fa-star text-[11px]"></i>
					<span>{course.rating || 4.8}</span>
					<span class="text-slate-400 font-normal">({course.students_count || '1.5k'})</span>
				</div>
			</div>

			<h3 class="font-display font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
				{course.title}
			</h3>

			<p class="text-slate-600 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
				{course.description}
			</p>
		</div>

		<div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
			<div class="text-xs text-slate-500 flex items-center gap-2">
				<span><i class="far fa-clock text-slate-400 me-1"></i>{course.duration || '6 Weeks'}</span>
				<span>•</span>
				<span><i class="far fa-user text-slate-400 me-1"></i>{course.instructor || 'EduInside'}</span>
			</div>

			<span
				class="bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap"
			>
				View Details <i class="fas fa-arrow-right ms-1 text-[10px]"></i>
			</span>
		</div>
	</div>
</a>
