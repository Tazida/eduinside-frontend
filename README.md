# EduInside Frontend (SvelteKit 5)

The public website for the EduInside eLearning platform: course catalogue, course details pages,
inline enrollment, free career counselling requests and a contact form.
It talks to the Laravel API in [`eduinside-backend`](https://github.com/Tazida/eduinside-backend).

**Live demo:** https://errand-deny-uneven.ngrok-free.dev

> Served from a development machine through ngrok, so it is only online while that machine is running.
> On the first visit ngrok shows a notice page — click **Visit Site**.


Then start everything from `eduinside-backend` (see its README for first-time setup):

```bash
cd ../eduinside-backend
./vendor/bin/sail up -d
```

If the API is unreachable, the site falls back to bundled sample data and shows "Local Mode" in the navbar.

## Build

```bash
npm run build    
npm run preview    
```

## Tech stack

SvelteKit 3 · Svelte 5 (runes) · TypeScript · Tailwind CSS v4 · Vite 8 · Font Awesome 6
