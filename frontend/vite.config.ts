import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '..', 'public');

export default defineConfig({
	plugins: [
		react(),
		{
			name: 'generate-pages-redirects',
			closeBundle() {
				fs.writeFileSync(
					path.join(outputDir, '_redirects'),
					'/posts/* /post.html?id=:splat 200\n/post/* /post.html?id=:splat 200\n'
				);
			}
		}
	],
	root: path.resolve(__dirname, 'pages'),
	publicDir: false,
	build: {
		outDir: outputDir,
		emptyOutDir: true,
		assetsDir: 'assets',
		modulePreload: {
			polyfill: false
		},
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, 'pages', 'index.html'),
				login: path.resolve(__dirname, 'pages', 'login.html'),
				register: path.resolve(__dirname, 'pages', 'register.html'),
				forgot: path.resolve(__dirname, 'pages', 'forgot.html'),
				reset: path.resolve(__dirname, 'pages', 'reset.html'),
				post: path.resolve(__dirname, 'pages', 'post.html'),
				settings: path.resolve(__dirname, 'pages', 'settings.html'),
				admin: path.resolve(__dirname, 'pages', 'admin.html')
			}
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	}
});
