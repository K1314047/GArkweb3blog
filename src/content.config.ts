import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			slug: z.string().optional(),
			title: z.string(),
			description: z.string().optional(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			categories: z.array(z.string()).optional(),
			tags: z.array(z.string()).optional(),
		}),
});

const page = defineCollection({
	// Load Markdown files in the `src/content/page/` directory.
	loader: glob({ base: './src/content/page', pattern: '**/*.md' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		layout: z.string().optional(),
		aliases: z.array(z.string()).optional(), // 支持多个别名
	}),
});

export const collections = { blog, page };
