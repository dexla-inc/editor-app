import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import crawl from "tree-crawl";

export const calculateGridSizes = (tree: Component) => {
  if (!tree) {
    tree = useEditorStore.getState().tree.root;
  }
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
};
