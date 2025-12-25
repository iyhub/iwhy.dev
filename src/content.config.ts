import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			date: z.coerce.date(),
			series: z.string().optional(),
			category: z.string(),
			tags: z.array(z.string()).optional(),
			description: z.string().optional(),
			draft: z.boolean().default(false),
			cover: image().optional(),
			updatedDate: z.coerce.date().optional(),
		}),
});

const weekly = defineCollection({
	loader: glob({ base: './src/content/weekly', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		issue: z.number(),  // 期数
		date: z.coerce.date(),
		description: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { posts, weekly };
