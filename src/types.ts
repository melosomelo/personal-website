import type { CollectionEntry } from "astro:content";

export type AugmentedPostData = CollectionEntry<"blog">["data"] & {
  readingTime: string;
  slug: string;
};
