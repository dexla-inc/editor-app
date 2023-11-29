import crawl from "tree-crawl";
import { Component } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";

export const calculateGridSizes = (tree: Component) => {
  const setColumnSpan = useEditorStore.getState().setColumnSpan;

  crawl(
    tree,
    (node, context) => {
      if (node.name === "Grid") {
        const parent = context.parent as Component;
        if (parent?.name === "GridColumn") {
          node.props!.gridSize = parent.props!.span;
        }
      } else if (node.name === "GridColumn") {
        const parent = context.parent as Component;
        if (parent?.name === "Grid") {
          const columnChilds = (parent.children ?? []).filter(
            (child) => child.name === "GridColumn",
          );

          const newSpanSize = Math.floor(
            parent.props!.gridSize / columnChilds.length ?? 1,
          );

          node.props!.span = newSpanSize;
          setColumnSpan(node.id!, newSpanSize);
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
            const newSpanSize =
              firstColumn.props!.span + node.props?.gridSize - sum;
            firstColumn.props!.span = newSpanSize;
            setColumnSpan(node.id!, newSpanSize);
          }
        }
      }
    },
    { order: "pre" },
  );
};
