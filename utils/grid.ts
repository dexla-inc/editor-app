import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Component, ComponentStructure } from "@/utils/editor";
import crawl from "tree-crawl";

export const calculateGridSizes = (tree?: ComponentStructure) => {
  if (!tree) {
    tree = useEditorTreeStore.getState().tree.root as ComponentStructure;
  }
  const setColumnSpan = useEditorTreeStore.getState().setColumnSpan;
  const componentResizedMap: { [parentId: string]: Component } = {};

  crawl(
    tree,
    (nodeTree, context) => {
      // TODO: workaround
      const node = nodeTree?.name
        ? nodeTree
        : useEditorTreeStore.getState().componentMutableAttrs[nodeTree?.id!];
      if (node.name === "Grid") {
        const parentTree = context.parent;
        const parent =
          useEditorTreeStore.getState().componentMutableAttrs[parentTree?.id!];
        if (parent?.name === "GridColumn") {
          node.props!.gridSize = parent.props?.span;
        }
      } else if (node.name === "GridColumn") {
        const parentTree = context.parent;
        const parent =
          useEditorTreeStore.getState().componentMutableAttrs[parentTree?.id!];
        if (parent?.name === "Grid") {
          const sibilings =
            (parentTree?.children ?? []).filter((childTree) => {
              const child =
                useEditorTreeStore.getState().componentMutableAttrs[
                  childTree?.id!
                ];
              return child?.name === "GridColumn";
            }) ?? [];

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

          let siblingsSpan = parent.props?.gridSize;

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

          if (node.props?.span) node.props.span = siblingsSpan;

          setColumnSpan(node.id!, siblingsSpan);
        }
      }
    },
    { order: "pre" },
  );
};
