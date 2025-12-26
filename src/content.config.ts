import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';

// 分类集合
const categories = defineCollection({
	loader: glob({ base: './src/content/categories', pattern: '*.json' }),
	schema: z.object({
		name: z.string(),           // 中文显示名
		description: z.string().optional(),
	}),
});

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			date: z.coerce.date(),
			series: z.string().optional(),
			category: reference('categories'),  // 引用分类 slug
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

export const collections = { categories, posts, weekly };
