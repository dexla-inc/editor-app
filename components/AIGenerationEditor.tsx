import { PageResponse } from "@/requests/pages/types";
import { MantineThemeExtended } from "@/stores/editor";
import {
  Component,
  DropTarget,
  EditorTree,
  Row,
  addComponent,
  getComponentBeingAddedId,
  getNewComponent,
} from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import { MutableRefObject } from "react";

type Props = {
  componentBeingAddedId: MutableRefObject<string | undefined>;
  theme: MantineThemeExtended;
  updateTreeComponentChildren: (
    componentId: string,
    children: Component[],
  ) => void;
  setTree: (
    tree: EditorTree,
    options?: { onLoad?: boolean; action?: string },
  ) => void;
  pages: PageResponse[];
  tree: EditorTree;
  dropTarget: DropTarget;
};

export const createComponentEditorHandler = ({
  componentBeingAddedId,
  theme,
  updateTreeComponentChildren,
  setTree,
  pages,
  tree,
  dropTarget,
}: Props) => {
  return function (row: Row) {
    const newComponents = getNewComponent(row, theme, pages);
    const id = getComponentBeingAddedId(tree.root);

    if (!id) {
      const copy = cloneDeep(tree);
      addComponent(copy.root, newComponents, dropTarget);
      setTree(copy, { action: `Added ${newComponents.name}` });
    } else {
      componentBeingAddedId.current = id;
      updateTreeComponentChildren(id, newComponents.children!);
    }
  };
};
