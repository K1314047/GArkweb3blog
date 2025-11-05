// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://zishu.me',
	integrations: [mdx(), sitemap()],
	build: {
		format: 'file', // 生成 .html 结尾的文件
	},
});
