import type { CollectionEntry } from "astro:content";
import type { AugmentedPostData } from "../types";

export default async function augmentPostData(
  post: CollectionEntry<"blog">
): Promise<AugmentedPostData> {
  const { remarkPluginFrontmatter } = await post.render();
  return {
    readingTime: remarkPluginFrontmatter.readingTime,
    slug: post.slug,
    ...post.data,
  };
}
