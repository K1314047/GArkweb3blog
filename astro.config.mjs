// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://1314047.xyz',

	integrations: [
		mdx(),
		sitemap(),
		pagefind(),
	],

	devToolbar: {
		enabled: false,
	},

	compressHTML: false,

	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'material-theme-darker',
			},
			wrap: true,
		},
	},

	vite: {
		assetsInclude: ['**/*.HEIC', '**/*.heic'],
	},
});