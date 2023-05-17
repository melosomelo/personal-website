import { z, defineCollection } from "astro:content";

export const collections = {
  blog: defineCollection({
    schema: z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      subtitle: z.string(),
      seoSubtitle: z.string().optional(),
      publishedAt: z.date(),
      lastEditedAt: z.date().optional(),
      categories: z.string().array(),
      draft: z.boolean().optional(),
    }),
  }),
};
