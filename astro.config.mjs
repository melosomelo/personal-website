import { defineConfig } from "astro/config";
import { calculateReadingTime } from "./src/lib/plugins/readingTime.mjs";
import customDirectives from "./src/lib/plugins/customDirectives.js";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import syntaxTheme from "./public/themes/theme.json";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: syntaxTheme,
    },
    remarkPlugins: [
      calculateReadingTime,
      remarkDirective,
      remarkMath,
      customDirectives,
    ],
    rehypePlugins: [
      [
        "rehype-rewrite",
        {
          selector: "a, table",
          rewrite: (node, index, parent) => {
            if (node.type === "element") {
              switch (node.tagName) {
                case "table":
                  const tableContainer = {
                    type: "element",
                    tagName: "div",
                    properties: {
                      class: "table-container",
                    },
                    children: [node],
                  };
                  parent.children[index] = tableContainer;
                  break;
                case "a":
                  node.properties.target = "_blank";
                  break;
                default:
                  break;
              }
            }
          },
        },
      ],
      rehypeKatex,
    ],
  },
});
