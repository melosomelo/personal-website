import { visit } from "unist-util-visit";
export default function customDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        switch (node.name) {
          case "details":
            // Populating the <details />
            const detailsData = node.data || (node.data = {});
            detailsData.hName = "details";
            // Populating the sumamry
            const summaryData =
              node.children[0].data || (node.children[0].data = {});
            summaryData.hName = "summary";
            break;
          default:
            throw new Error(`Unsupported directive "${node.name}"!`);
        }
      }
    });
  };
}
