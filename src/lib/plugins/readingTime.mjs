import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function calculateReadingTime() {
  return function (tree, { data }) {
    // Convert the AST to regular text
    const textOnPage = toString(tree);
    // Calculate the reading time based on the text
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
