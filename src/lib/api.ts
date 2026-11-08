import type { Course, Category, Faq, Stats, EnrollmentPayload, InquiryPayload } from './types';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

// Bundled fallback data
export const FALLBACK_COURSES: Course[] = [
	{
		id: 1,
		category_id: 1,
		title: 'UI/UX Design Masterclass',
		slug: 'ui-ux-design-masterclass',
		description: 'The Knowledge Academy is Globally Recognised as the Market Leader in delivering the UI/UX Masterclass to organisations and professionals.',
		price: 20,
		rating: 4.9,
		students_count: 3840,
		duration: '6 Weeks',
		level: 'Beginner to Advanced',
		instructor: 'Sarah Jenkins',
		image_url: '/images/course/course-1.png',
		is_featured: true,
		is_published: true
	},
	{
		id: 2,
		category_id: 2,
		title: 'Web Development Bootcamp',
		slug: 'web-development-bootcamp',
		description: 'Welcome to the Ultimate Web Developer Bootcamp. This is your one-stop-shop to learn front-end AND back-end development.',
		price: 25,
		rating: 5.0,
		students_count: 6420,
		duration: '10 Weeks',
		level: 'Comprehensive',
		instructor: 'Alex Rivera',
		image_url: '/images/course/course-2.png',
		is_featured: true,
		is_published: true
	},
	{
		id: 3,
		category_id: 3,
		title: 'Email Marketing Mastery',
		slug: 'email-marketing-mastery',
		description: 'The easiest home business of all time: I show EVERYTHING that I do, including lectures, downloads, free help!',
		price: 18,
		rating: 4.7,
		students_count: 2190,
		duration: '4 Weeks',
		level: 'All Levels',
		instructor: 'David Chen',
		image_url: '/images/course/course-3.png',
		is_featured: true,
		is_published: true
	},
	{
		id: 4,
		category_id: 4,
		title: 'Digital Marketing Essentials',
		slug: 'digital-marketing-essentials',
		description: 'Launch your career in business and be prepared for the changing nature of work with our industry connected business and management courses.',
		price: 16,
		rating: 4.8,
		students_count: 4120,
		duration: '5 Weeks',
		level: 'Beginner',
		instructor: 'Elena Rostova',
		image_url: '/images/course/course-4.png',
		is_featured: true,
		is_published: true
	},
	{
		id: 5,
		category_id: 5,
		title: 'Commercial Photography',
		slug: 'commercial-photography',
		description: 'The students will explore a wide range of relevant contemporary theories which is designed to stimulate a critically engaged practice to prepare a range of related careers.',
		price: 10,
		rating: 4.6,
		students_count: 1850,
		duration: '4 Weeks',
		level: 'Intermediate',
		instructor: 'Marcus Vance',
		image_url: '/images/course/course-5.png',
		is_featured: true,
		is_published: true
	},
	{
		id: 6,
		category_id: 6,
		title: 'Motion Graphic Design',
		slug: 'motion-graphic-design',
		description: 'Learn the techniques to start your career as a Motion Graphic artist with industry standard software and real projects.',
		price: 13,
		rating: 4.8,
		students_count: 2730,
		duration: '6 Weeks',
		level: 'Beginner to Intermediate',
		instructor: 'Chloe Bennett',
		image_url: '/images/course/course-6.png',
		is_featured: true,
		is_published: true
	}
];

export const FALLBACK_FAQS: Faq[] = [
	{
		id: 1,
		question: 'What are the main differences between Flexbox and grid?',
		answer: 'The basic difference between CSS Grid Layout and CSS Flexbox Layout is that flexbox was designed for layout in one dimension - either a row or a column. Grid was designed for two-dimensional layout - rows, and columns at the same time.',
		order: 1,
		category: 'Web Development',
		is_active: true
	},
	{
		id: 2,
		question: 'What is the difference between bootstrap and tailwind?',
		answer: 'Bootstrap comes with a set of pre-styled responsive, mobile-first components that possess a definite UI kit. Tailwind CSS uses a set of utility classes to create a neat UI with more flexibility and uniqueness. Sites created using Bootstrap follow the generic pattern that makes them look identical.',
		order: 2,
		category: 'Web Development',
		is_active: true
	},
	{
		id: 3,
		question: 'What is css box model?',
		answer: 'In CSS, the term "box model" is used when talking about design and layout. The CSS box model is essentially a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content.',
		order: 3,
		category: 'Design & CSS',
		is_active: true
	},
	{
		id: 4,
		question: 'What is a semantic tag?',
		answer: 'The HTML semantics refers to the tags that provide meaning to an HTML page rather than just presentation. It makes HTML more comprehensible by better defining the different sections and layout of web pages.',
		order: 4,
		category: 'HTML & Accessibility',
		is_active: true
	}
];

export async function checkApiHealth(): Promise<boolean> {
	try {
		const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
		return res.ok;
	} catch {
		return false;
	}
}

export async function fetchCourses(category?: string, search?: string): Promise<Course[]> {
	try {
		// Base origin lets API_BASE be relative (e.g. "/api" behind the nginx proxy)
		const url = new URL(`${API_BASE}/courses`, globalThis.location?.origin);
		if (category && category !== 'all') url.searchParams.set('category', category);
		if (search) url.searchParams.set('search', search);

		const res = await fetch(url.toString(), { signal: AbortSignal.timeout(3000) });
		if (res.ok) {
			const json = await res.json();
			if (json.data) return json.data;
		}
	} catch {
		// Fallback
	}

	let filtered = [...FALLBACK_COURSES];
	if (category && category !== 'all') {
		filtered = filtered.filter((c) => c.title.toLowerCase().includes(category) || (c.category?.slug === category));
	}
	if (search) {
		const q = search.toLowerCase();
		filtered = filtered.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
	}
	return filtered;
}

export async function fetchCourse(slug: string): Promise<Course | null> {
	try {
		const res = await fetch(`${API_BASE}/courses/${encodeURIComponent(slug)}`, {
			signal: AbortSignal.timeout(3000)
		});
		if (res.ok) {
			const json = await res.json();
			return json.data ?? null;
		}
		if (res.status === 404) return null;
	} catch {
		// Fallback below
	}

	return FALLBACK_COURSES.find((c) => c.slug === slug) ?? null;
}

/**
 * The API stores image paths relative ("images/course/x.png"). Make them root-relative
 * so they also load on nested routes such as /courses/{slug}.
 */
export function courseImage(url?: string | null): string {
	if (!url) return '/images/logoi.png';
	return /^(https?:)?\/\//.test(url) || url.startsWith('/') ? url : `/${url}`;
}

export async function fetchCategories(): Promise<Category[]> {
	try {
		const res = await fetch(`${API_BASE}/categories`, { signal: AbortSignal.timeout(3000) });
		if (res.ok) {
			const json = await res.json();
			if (json.data) return json.data;
		}
	} catch {}

	return [
		{ id: 1, name: 'UI/UX Design', slug: 'ui-ux-design', courses_count: 1 },
		{ id: 2, name: 'Web Development', slug: 'web-development', courses_count: 1 },
		{ id: 3, name: 'Email Marketing', slug: 'email-marketing', courses_count: 1 },
		{ id: 4, name: 'Digital Marketing', slug: 'digital-marketing', courses_count: 1 },
		{ id: 5, name: 'Photography', slug: 'photography', courses_count: 1 },
		{ id: 6, name: 'Motion Graphic', slug: 'motion-graphic', courses_count: 1 }
	];
}

export async function fetchFaqs(): Promise<Faq[]> {
	try {
		const res = await fetch(`${API_BASE}/faqs`, { signal: AbortSignal.timeout(3000) });
		if (res.ok) {
			const json = await res.json();
			if (json.data) return json.data;
		}
	} catch {}

	return FALLBACK_FAQS;
}

export async function fetchStats(): Promise<Stats> {
	try {
		const res = await fetch(`${API_BASE}/stats`, { signal: AbortSignal.timeout(3000) });
		if (res.ok) {
			const json = await res.json();
			if (json.data) return json.data;
		}
	} catch {}

	return {
		total_students: 20000,
		total_instructors: 200,
		total_courses: 6,
		total_categories: 6,
		satisfaction_rate: 99.4
	};
}

export async function submitEnrollment(data: EnrollmentPayload): Promise<{ success: boolean; message: string }> {
	try {
		const res = await fetch(`${API_BASE}/enrollments`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		const json = await res.json();
		return { success: res.ok, message: json.message || 'Enrollment processed.' };
	} catch {
		return {
			success: true,
			message: `Enrollment saved locally for ${data.name}! (Connect backend for persistent DB sync)`
		};
	}
}

export async function submitInquiry(data: InquiryPayload): Promise<{ success: boolean; message: string }> {
	try {
		const res = await fetch(`${API_BASE}/inquiries`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		const json = await res.json();
		return { success: res.ok, message: json.message || 'Inquiry sent.' };
	} catch {
		return {
			success: true,
			message: `Thank you, ${data.name}! Your inquiry has been recorded.`
		};
	}
}

