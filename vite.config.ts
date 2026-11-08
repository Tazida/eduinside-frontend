import adapter from '@sveltejs/adapter-static';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

// The only API calls the website makes. Everything else under /api (enrollment and inquiry
// lists, course create/update/delete, auth) is not forwarded, so sharing the dev server
// through a public tunnel does not expose it.
const PUBLIC_API: [method: string, path: RegExp][] = [
	['GET', /^\/api\/(health|stats|faqs)\/?$/],
	['GET', /^\/api\/(courses|categories)(\/[^/]+)?\/?$/],
	['POST', /^\/api\/(enrollments|inquiries)\/?$/]
];

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		server: {
			port: 5175,
			// Tunnels used to share the dev server (VS Code port forwarding, ngrok).
			// *.localhost (eduinside.localhost) is always allowed.
			allowedHosts: ['.devtunnels.ms', '.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.dev'],
			// The browser calls /api on the site's own origin and Vite forwards it to Laravel,
			// so the API works wherever the site is opened from (localhost, caddy, a tunnel).
			proxy: {
				'/api': {
					// Docker: http://laravel.test (set in eduinside-backend/compose.yaml)
					target: env.API_PROXY_TARGET || 'http://localhost:8000',
					changeOrigin: true,
					bypass(req) {
						const path = (req.url ?? '').split('?')[0];
						const allowed = PUBLIC_API.some(([method, re]) => req.method === method && re.test(path));
						return allowed ? undefined : false; // false → 404
					}
				}
			}
		},
		preview: { port: 4175 },
		plugins: [
			tailwindcss(),
			sveltekit({
				compilerOptions: {
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},
				alias: {
					$lib: './src/lib'
				},
				adapter: adapter({ fallback: 'index.html' })
			})
		]
	};
});
