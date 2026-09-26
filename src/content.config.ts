import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Tautan project selalu mengarah ke web publik, jadi skema hanya menerima
// http/https. `z.string().url()` sendiri masih meloloskan skema lain seperti
// `javascript:` atau `mailto:`, yang tidak pernah benar untuk tombol project.
const httpUrl = z
  .string()
  .url()
  .refine((value) => /^https?:$/.test(new URL(value).protocol), { message: 'Tautan harus http atau https' });

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
    // `link` = satu tautan (proyek lama). `links` = beberapa tautan berlabel,
    // dipakai kalau satu produk punya lebih dari satu muka publik.
    // Kalau keduanya ada, `links` yang dipakai.
    link: httpUrl.optional(),
    links: z
      .array(z.object({ label: z.string().trim().min(1), href: httpUrl }))
      .nonempty()
      .optional(),
    description: z.string(),
    challenge: z.string(),
    solution: z.string(),
    services: z.array(z.string())
  })
});

export const collections = { projects };
