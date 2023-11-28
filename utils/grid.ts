import crawl from "tree-crawl";
import { Component } from "@/utils/editor";

export const calculateGridSizes = (tree: Component) => {
  crawl(
    tree,
    (node, context) => {
      if (node.name === "Grid") {
        const parent = context.parent as Component;
        if (parent.name === "GridColumn") {
          node.props!.gridSize = parent.props!.span;
        }
      } else if (node.name === "GridColumn" && !node.props?.resized) {
        const parent = context.parent as Component;
        if (parent.name === "Grid") {
          const columnChilds = (parent.children ?? []).filter(
            (child) => child.name === "GridColumn",
          );

          const newSpanSize = Math.floor(
            parent.props!.gridSize / columnChilds.length ?? 1,
          );

          node.props!.span = newSpanSize;
        }
      }
    },
    { order: "pre" },
  );

  // TODO: Do this in a single pass
  crawl(
    tree,
    (node) => {
      if (node.name === "Grid") {
        const sum = (node.children ?? []).reduce((acc, child) => {
          return acc + (child.props?.span ?? 0);
        }, 0);

        if (sum < node.props?.gridSize) {
          const firstColumn = node.children?.find((child) => {
            return child.name === "GridColumn";
          })!;

          if (firstColumn) {
            firstColumn.props!.span =
              firstColumn.props!.span + node.props?.gridSize - sum;
          }
        }
      }
    },
    { order: "pre" },
  );
};
