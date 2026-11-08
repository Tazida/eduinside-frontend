export interface Category {
	id: number;
	name: string;
	slug: string;
	icon?: string;
	description?: string;
	courses_count?: number;
}

export interface CurriculumModule {
	title: string;
	lessons?: string[];
}

export interface Course {
	id: number;
	category_id?: number;
	title: string;
	slug: string;
	description: string;
	outcomes?: string[] | null;
	curriculum?: CurriculumModule[] | null;
	batch_starts_at?: string | null;
	schedule?: string | null;
	price: number;
	rating: number;
	students_count: number;
	duration?: string;
	level?: string;
	instructor?: string;
	image_url: string;
	is_featured?: boolean;
	is_published?: boolean;
	category?: Category;
}

export interface Faq {
	id: number;
	question: string;
	answer: string;
	order: number;
	category: string;
	is_active: boolean;
}

export interface Stats {
	total_students: number;
	total_instructors: number;
	total_courses: number;
	total_categories: number;
	satisfaction_rate: number;
}

export interface EnrollmentPayload {
	course_id: number;
	name: string;
	email: string;
	phone?: string;
	notes?: string;
}

export interface InquiryPayload {
	type?: 'contact' | 'counselling';
	name: string;
	email: string;
	phone?: string;
	subject?: string;
	message: string;
}

