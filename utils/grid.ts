import crawl from "tree-crawl";
import { Component } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";

export const calculateGridSizes = (tree: Component) => {
  const setColumnSpan = useEditorStore.getState().setColumnSpan;
  const componentResizedMap: { [parentId: string]: Component } = {};

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
          const sibilings =
            (parent.children ?? []).filter(
              (child) => child.name === "GridColumn",
            ) ?? [];

          const isAlone = sibilings.length === 1;
          // if there's no resized column in the current depth and the current column is resized, skip this column,
          // if there's a resized column in the current depth already, go ahead and resize it anyway
          const resizedComponentOnThisParent = componentResizedMap[parent.id!];
          if (
            !resizedComponentOnThisParent &&
            node.props?.resized &&
            !isAlone
          ) {
            componentResizedMap[parent.id!] = node;
            return;
          }

          if (node.props?.resized) {
            node.props!.resized = false;
          }

          let siblingsSpan = parent.props!.gridSize;

          if (!isAlone) {
            const diff =
              parent.props!.gridSize -
              (resizedComponentOnThisParent?.props?.span ?? 0);

            const final = diff / (sibilings.length - 1);

            siblingsSpan = Math.floor(
              resizedComponentOnThisParent
                ? final
                : parent.props!.gridSize / sibilings.length ?? 1,
            );
          }

          node.props!.span = siblingsSpan;
          setColumnSpan(node.id!, siblingsSpan);
        }
      }
    },
    { order: "pre" },
  );

  // TODO: Implement this taking in consideration the resized columns. Also, do this in a single pass

  // recalculate column sizes if the sum of all columns is less than the grid size
  // take in consideration the resized columns
  /* crawl(
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
            setColumnSpan(firstColumn.id!, newSpanSize);
          }
        }
      }
    },
    { order: "pre" },
  ); */
};
