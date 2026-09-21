import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.string(),
    year: z.string(),
    image: z.string(),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).optional(),
    width: z.number(),
    height: z.number(),
    link: z.string().optional(),
    description: z.string(),
    challenge: z.string(),
    solution: z.string(),
    services: z.array(z.string())
  })
});

export const collections = { projects };
