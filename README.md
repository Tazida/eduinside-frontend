# EduInside Frontend (SvelteKit 5)

The public website for the EduInside eLearning platform: course catalogue, course details pages,
inline enrollment, free career counselling requests and a contact form.
It talks to the Laravel API in [`eduinside-backend`](https://github.com/Tazida/eduinside-backend).

## Run the whole stack with Docker (recommended)

The frontend runs inside the backend's Docker stack (Laravel Sail). Put the two repos next to each other:

```
tazida/
├── eduinside-backend     (API, MySQL, Mailhog, caddy — owns compose.yaml)
└── eduinside-frontend    (this repo)
```

Then start everything from `eduinside-backend` (see its README for first-time setup):

```bash
cd ../eduinside-backend
./vendor/bin/sail up -d
```

| App | URL |
|---|---|
| Website | http://eduinside.localhost (direct: http://localhost:5175) |
| API | http://localhost/api |
| Emails (Mailhog) | http://localhost:8025 |

- The source is mounted into the container, so code changes show up in the browser right away.
- The container keeps its own `node_modules`. After `package.json` changes, install inside it:
  `docker exec eduinside-backend-frontend-1 npm install && docker restart eduinside-backend-frontend-1`
- If every page suddenly returns 500 after adding or deleting a file in `src/lib`, restart the container:
  `docker restart eduinside-backend-frontend-1`

## Run without Docker

Requires Node 22+ and the API running on `http://localhost:8000` (or the zero-dependency mock:
`node ../eduinside-backend/dev-server.js`).

```bash
cp .env.example .env    # first time only
npm install
npm run dev             # http://localhost:5175
```

If the API is unreachable, the site falls back to bundled sample data and shows "Local Mode" in the navbar.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE` | `http://localhost:8000/api` | Base URL of the Laravel API. Read at build/dev-server start, so restart after changing it. In Docker it is set to `http://localhost/api` by `eduinside-backend/compose.yaml`. |

## Build

```bash
npm run build      # static site in build/ (adapter-static, SPA fallback to index.html)
npm run preview    # serve the build locally
```

Any static host works; it must serve `index.html` for unknown paths so routes like `/courses/{slug}` load.

## Pages

| Route | What it shows |
|---|---|
| `/` | Hero, stats, course catalogue (search, category filter, sort), free counselling form, FAQ |
| `/courses/{slug}` | Course details: what you'll learn, curriculum, instructor, next batch, inline enrollment form and counselling form |

There are no popups: every form is part of the page and shows its errors and confirmation inline.

## Project structure

```
src/
├── routes/
│   ├── +layout.svelte            Navbar + Footer around every page
│   ├── +page.svelte              Home page
│   └── courses/[slug]/+page.svelte   Course details page
└── lib/
    ├── api.ts                    API client + offline fallback data
    ├── types.ts                  Course, Category, Faq, … types
    ├── format.ts                 Date helpers (next batch, "starts in N days")
    ├── validation.ts             Email check + shared input styling
    └── components/
        ├── Navbar, Hero, StatsSection, CourseGrid, CourseCard, FaqSection, Footer
        ├── EnrollForm.svelte         Inline enrollment for one course
        └── CounsellingForm.svelte    Inline free-counselling (call-back) request
static/images/                    Logos, course and cover images
```

## API endpoints used

| Method | Endpoint | Used by |
|---|---|---|
| `GET` | `/api/health` | Navbar status badge |
| `GET` | `/api/stats` | Stats section |
| `GET` | `/api/courses`, `/api/courses/{slug}` | Course catalogue, course page |
| `GET` | `/api/categories` | Category filter, counselling topics |
| `GET` | `/api/faqs` | FAQ section |
| `POST` | `/api/enrollments` | Enrollment form |
| `POST` | `/api/inquiries` | Contact form (`type: contact`) and counselling form (`type: counselling`) |

## Tech stack

SvelteKit 3 · Svelte 5 (runes) · TypeScript · Tailwind CSS v4 · Vite 8 · Font Awesome 6
